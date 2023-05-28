use futures_util::{Stream, StreamExt};
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
use std::{sync::{Arc, atomic::AtomicUsize}, collections::{HashMap, BTreeMap}};
use tokio::sync::Mutex;

#[macro_use]
extern crate serde_derive;

extern crate serde;
extern crate serde_json;


const DURATION: u64 = 60*60*2;
const FLASH_DURATION: u64 = 5;
static LIVE_CHAT_COUNTER_KONSULTASI: AtomicUsize = AtomicUsize::new(0);
use tokio::sync::mpsc::UnboundedSender;

#[derive(Debug,Clone,Default)]
pub struct UserSender(BTreeMap<i64,UnboundedSender<konsultasi::Message>>);

#[derive(Debug,Clone,Default)]
pub struct Chats(HashMap<i64,UserSender>);

#[tokio::main]
async fn main() -> Result<()>{
    //let live_konsultasi = UserSender(HashMap::<i64, UnboundedSender<konsultasi::Message>>::new());
    let live_konsultasi = Chats(HashMap::new());
    let live_konsultasi = Arc::new(Mutex::new(live_konsultasi));
    let lk2 = live_konsultasi.clone();

    let private_token_signature = dotenv::var("PRIVATE_TOKEN_SIGNATURE")?;
    let flash_private_token_signature = dotenv::var("FLASH_PRIVATE_TOKEN_SIGNATURE")?;
    let key = <Hmac::<Sha256> as Mac>::new_from_slice(private_token_signature.as_bytes())?;
    let flash_key = <Hmac::<Sha256> as Mac>::new_from_slice(flash_private_token_signature.as_bytes())?;
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

    let list_consultationoffer = warp::path("list_consultationoffer")
        .and(warp::get())
        .and(with_state(db_cli.clone())) 
        .then(konsultasi::list_consultationoffer);

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
        .and(with_state(live_konsultasi.clone()))
        .then(konsultasi::write_konsultasi);

    let konsultasi_flash_auth = warp::path("konsultasi_flash_auth")
        .and(warp::get())//unlike login which needs username and password in post data
        .and(warp::header::<String>("Authorization"))
        .and(with_state(key.clone()))
        .and(with_state(flash_key.clone()))
        .and(with_state(db_cli.clone())) 
        .then(konsultasi::flash_auth);

    let konsultasi_chat = warp::path("live_konsultasi")
        .and(warp::get())
        .and(warp::path::param::<i64>())
        .and(warp::query::<HashMap<String,String>>())
        .and(with_state(flash_key.clone()))
        .and(with_state(db_cli.clone())) 
        .and(with_state(live_konsultasi.clone()))
        .then(konsultasi::live_chat)
//        .map(move |
//    bearer: String,
//    konsultasi_id: i64,
//    key: Hmac<Sha256>,
//    db: Arc<tokio_postgres::Client>,
//    chats: Arc<Mutex<Chats>>
//            |async{
//            let stream = konsultasi::live_chat(bearer,konsultasi_id,key,db,chats).await;
//            warp::sse::reply(warp::sse::keep_alive().stream(stream))
//            }
//        )
    ;

    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(vec!["GET", "POST", "DELETE"])
        .allow_headers(
            vec![
            "User-Agent",
            "Sec-Fetch-Mode",
            "Referer",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
            "Content-Type",
            "Authorization",
            "user-agent",
            "sec-fetch-mode",
            "referer",
            "origin",
            "access-control-request-method",
            "access-control-request-headers",
            "content-type",
            "authorization",
            ]
        )
        .allow_credentials(true)
    ;

    let routes = hello
        .or(register)
        .or(login)
        .or(delete)
        .or(list_forums)
        .or(write_forum)
        .or(load_forum)
        .or(list_konsultan)
        .or(list_konsultasi)
        .or(list_consultationoffer)
        .or(create_consultationoffer)
        .or(accept_consultationoffer)
        .or(delete_consultationoffer)
        .or(load_konsultasi)
        .or(write_konsultasi)
        .or(konsultasi_chat)
        .or(konsultasi_flash_auth)
        
        //.with(cors)
    ;



    let shutdown = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install CTRL+C signal handler");
    };
    let (_, serving) =
        warp::serve(routes).bind_with_graceful_shutdown(([127, 0, 0, 1], 3030), shutdown);

    tokio::select! {
        _ = serving => {}
    }
    return Ok(())
}
