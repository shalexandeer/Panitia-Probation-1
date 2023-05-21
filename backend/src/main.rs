use warp::Filter;
use hmac::{Hmac, Mac};
use sha2::Sha256;

mod account;
mod investasi;
mod konsultasi;
mod forum;

mod utils;
use anyhow::Result;
use utils::sql::*;
use std::{sync::Arc, collections::HashMap};


#[macro_use]
extern crate serde_derive;

extern crate serde;
extern crate serde_json;


const DURATION: u64 = 60*60*2;

#[tokio::main]
async fn main() -> Result<()>{
    let private_token_signature = dotenv::var("PRIVATE_TOKEN_SIGNATURE")?;
    let key = <Hmac::<Sha256> as Mac>::new_from_slice(private_token_signature.as_bytes())?;
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
    let hello = warp::path("hello").and(warp::get()).map(|| "Hello!");

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
        .and(warp::delete())
        .and(warp::header::<String>("Authorization"))
        .and(with_state(key.clone()))
        .and(with_state(db_cli.clone()))        
        .then(account::delete);

    let list_forums = warp::path("list_forums")
        .and(warp::get())
        .and(with_state(db_cli.clone()))        
        .then(forum::list_forums);
    
    let write_forum = warp::path("write_forum")
        .and(warp::post())
        .and(warp::header::<String>("Authorization"))
        .and(warp::body::json())
        .and(with_state(key.clone()))
        .and(with_state(db_cli.clone())) 
        .then(forum::write_forum);

    let load_forum = warp::path("load_forum")
        .and(warp::get())
        .and(warp::path::param())
        .and(with_state(db_cli.clone())) 
        .then(forum::load_forum);

    let list_konsultan = warp::path("list_konsultan")
        .and(warp::get())
        .and(with_state(db_cli.clone())) 
        .then(konsultasi::list_konsultan);
    
    //https://stackoverflow.com/a/51265003/18638036 use of bearer token in
    //GET request's header
    let list_konsultasi = warp::path("list_konsultasi")
        .and(warp::get())
        .and(warp::header::<String>("Authorization"))
        .and(with_state(key.clone()))
        .and(with_state(db_cli.clone())) 
        .then(konsultasi::list_konsultasi);

    let create_consultationoffer = warp::path("create_consultationoffer")
        .and(warp::post())
        .and(warp::header::<String>("Authorization"))
        .and(warp::body::json())
        .and(with_state(key.clone()))
        .and(with_state(db_cli.clone())) 
        .then(konsultasi::create_consultationoffer);

    let delete_consultationoffer = warp::path("delete_consultationoffer")
        .and(warp::delete())
        .and(warp::header::<String>("Authorization"))
        .and(warp::query::<HashMap<String,String>>())
        .and(with_state(key.clone()))
        .and(with_state(db_cli.clone())) 
        .then(konsultasi::delete_consultationoffer);

    let accept_consultationoffer = warp::path("accept_consultationoffer")
        .and(warp::post())
        .and(warp::header::<String>("Authorization"))
        .and(warp::body::json())
        .and(with_state(key.clone()))
        .and(with_state(db_cli.clone())) 
        .then(konsultasi::accept_consultationoffer);

    let load_konsultasi = warp::path("load_konsultasi")
        .and(warp::get())
        .and(warp::header::<String>("Authorization"))
        .and(warp::path::param())
        .and(with_state(key.clone()))
        .and(with_state(db_cli.clone())) 
        .then(konsultasi::load_konsultasi);

    let write_konsultasi = warp::path("write_konsultasi")
        .and(warp::post())
        .and(warp::header::<String>("Authorization"))
        .and(warp::body::json())
        .and(with_state(key.clone()))
        .and(with_state(db_cli.clone())) 
        .then(konsultasi::write_konsultasi);

    let routes = hello
        .or(register)
        .or(login)
        .or(delete)
        .or(list_forums)
        .or(write_forum)
        .or(load_forum)
        .or(list_konsultan)
        .or(list_konsultasi)
        .or(create_consultationoffer)
        .or(accept_consultationoffer)
        .or(delete_consultationoffer)
        .or(load_konsultasi)
        .or(write_konsultasi)
    ;

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
    return Ok(())
}
