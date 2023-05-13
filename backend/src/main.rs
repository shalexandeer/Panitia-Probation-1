use warp::Filter;
use hmac::{Hmac, Mac};
use sha2::Sha256;

mod account;

mod utils;
use anyhow::Result;
// register consultant
// refister UMKM
// register investor
use utils::sql::*;
use std::sync::Arc;
#[tokio::main]
async fn main() -> Result<()>{
    let private_token_signature = dotenv::var("PRIVATE_TOKEN_SIGNATURE")?;
    let key: Hmac<Sha256> = Hmac::new_from_slice(private_token_signature.as_bytes()).unwrap();
    let pg_config = dotenv::var("POSTGRES_URL")?;

    let (client, connection) = tokio_postgres::connect(&pg_config, tokio_postgres::NoTls)
        .await
        .unwrap();

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            panic!("{e:#?}")
        }
    });
    let db_cli = Arc::new(client);
    let routes = warp::path("hello").and(warp::get()).map(|| "Hello!");



    let register = warp::path("register")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_state(db_cli.clone()))        
        .then(account::register);

    let login = warp::path("login")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_state(db_cli.clone())) 
        .and(with_state(key.clone()))
        .then(account::login);

    let delete = warp::path("delete")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_state(db_cli.clone()))        
        .then(account::delete);

    let verify = warp::path("verify")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_state(key.clone()))        
        .then(account::verify);

    let routes = routes
        .or(register)
        .or(login)
        .or(delete)
        .or(verify);

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
    return Ok(())
}
