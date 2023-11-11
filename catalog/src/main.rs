use lambda_http::{lambda_runtime::Error, service_fn, IntoResponse, Request};
use log::debug;

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt::init();
    debug!("logger has been set up");

    lambda_http::run(service_fn(my_handler)).await?;

    Ok(())
}

async fn my_handler(request: Request) -> Result<impl IntoResponse, Error> {
    debug!("handling a request, Request is: {:?}", request);

    let request_json = match request.body() {
        lambda_http::Body::Text(json_string) => json_string,
        _ => "",
    };

    debug!("Request JSON is : {:?}", request_json);

    Ok("the lambda was successful".to_string())
}
