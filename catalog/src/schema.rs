use async_graphql::{EmptySubscription, Object, Result, Schema, SimpleObject};
use lazy_static::lazy_static;

#[derive(SimpleObject)]
struct User {
    id: i32,
    name: String,
}

pub struct Query;

#[Object]
impl Query {
    async fn users(&self) -> Result<Vec<User>> {
        let users: Vec<User> = vec![
            User {
                id: 1,
                name: "Alex".into(),
            },
            User {
                id: 2,
                name: "Jesse".into(),
            },
        ];
        tracing::info!("Finished query");
        Ok(users)
    }
}

pub struct Mutation;

#[Object]
impl Mutation {
    async fn create_user(&self, name: String) -> Result<User> {
        tracing::info!("User not created (no datasource)");
        Ok(User { id: 1, name })
    }
}

lazy_static! {
    pub static ref SCHEMA: Schema<Query, Mutation, EmptySubscription> =
        Schema::build(Query, Mutation, EmptySubscription).finish();
}
