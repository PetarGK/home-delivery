use async_graphql::{
    Request as GraphQlRequest, Response as GraphQlResponse, ServerError as GraphQlError,
};
use http::{Method, StatusCode};
use lambda_http::{run, Body, Error, Request, Response};
use lambda_runtime::service_fn;
use std::fmt::Display;
use std::str::FromStr;

use catalog::errors::{ClientError, ServerError};
use catalog::schema::SCHEMA;
use tracing::subscriber::set_global_default;
use tracing_log::LogTracer;
use tracing_subscriber::{filter::Targets, layer::SubscriberExt, Registry};

#[tokio::main]
async fn main() -> Result<(), Error> {
    setup_tracing();
    run(service_fn(handle_request)).await?;
    Ok(())
}

fn setup_tracing() {
    LogTracer::init().expect("Failed to set logger");

    let log_levels = std::env::var("RUST_LOG").unwrap_or_else(|_| "info".to_string());
    let env_filter =
        Targets::from_str(&log_levels).expect("Failed to parse log levels from RUST_LOG env var");
    let subscriber = Registry::default().with(env_filter);
    set_global_default(subscriber).expect("Failed to set subscriber");
}

pub async fn handle_request(request: Request) -> Result<Response<Body>, Error> {
    let query = if request.method() == Method::POST {
        graphql_request_from_post(request)
    } else {
        Err(ClientError::MethodNotAllowed)
    };
    let query = match query {
        Err(e) => {
            return error_response(StatusCode::BAD_REQUEST, graphql_error(e));
        }
        Ok(query) => query,
    };
    let response_body =
        serde_json::to_string(&SCHEMA.execute(query).await).map_err(ServerError::from)?;

    Response::builder()
        .status(200)
        .body(Body::Text(response_body))
        .map_err(ServerError::from)
        .map_err(Error::from)
}

fn graphql_error(message: impl Display) -> String {
    let message = format!("{}", message);
    let response = GraphQlResponse::from_errors(vec![GraphQlError::new(message, None)]);
    serde_json::to_string(&response).expect("Valid response should never fail to serialize")
}

fn error_response(status: StatusCode, body: String) -> Result<Response<Body>, Error> {
    Ok(Response::builder().status(status).body(Body::Text(body))?)
}

fn graphql_request_from_post(request: Request) -> Result<GraphQlRequest, ClientError> {
    match request.into_body() {
        Body::Empty => Err(ClientError::EmptyBody),
        Body::Text(text) => {
            serde_json::from_str::<GraphQlRequest>(&text).map_err(ClientError::from)
        }
        Body::Binary(binary) => {
            serde_json::from_slice::<GraphQlRequest>(&binary).map_err(ClientError::from)
        }
    }
}
