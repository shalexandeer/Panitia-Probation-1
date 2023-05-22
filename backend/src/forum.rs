use hmac::Hmac;
use sha2::Sha256;

use std::sync::Arc;
use crate::{utils::response::*, account::bearer_verify};

pub async fn list_forums(
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let res0: Vec<_> = db.query(r#"
        SELECT id,title,tscreate::timestamptz(0)::text FROM forum 
    "#, &[]).await.unwrap().iter().map(
            |x|{
                let id = x.try_get::<&str,i64>("id").unwrap();
                let title = x.try_get::<&str,String>("title").unwrap();
                let tscreate = x.try_get::<&str,String>("tscreate").unwrap();
                (id,title,tscreate)
            }
        ).collect();
    
    return r200!{"list" => &res0[..]}
}
#[derive(Clone,PartialEq, Eq,Serialize,Deserialize)]
pub struct WriteForumParam{
    forum_id: i64,
    message: String,
}
pub async fn write_forum(
    authorization: String,
    param: WriteForumParam,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let token = if let Ok(x) = bearer_verify(&authorization, &key, &db).await{x}else{
        return r401!{
            "message" => "authentication error"
        }
    };
    if let Err(e) = db.query(r#"
        INSERT INTO 
            forummessage 
        (forum, writer, message) 
        VALUES 
            ($1, $2, $3) 
    "#, &[&param.forum_id,&token.id,&param.message]).await{
        println!("{e:#?}");
        return r500!{
            "message" => "something has gone wrong!"
        }
    }    
    return r200!{"list" => "sent message"}
}


pub async fn load_forum(
    forum_id: i64,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let res0: Vec<_> = db.query(r#"
        SELECT 
            m.id AS message_id, 
            m.writer AS writer_id, 
            t.name, 
            m.message, 
            m.tswrite::TIMESTAMPTZ(0)::TEXT 
        FROM 
            forummessage AS m 
        JOIN 
            (SELECT id,name FROM account) AS t 
        ON 
            m.writer=t.id
        WHERE 
            m.forum = $1
    "#, &[&forum_id]).await.unwrap().iter().map(
            |x|{
                // message_id | writer_id | name | message | tswrite 
                let message_id = x.try_get::<&str,i64>("message_id").unwrap();
                let writer_id = x.try_get::<&str,i64>("writer_id").unwrap();
                let name = x.try_get::<&str,String>("name").unwrap();
                let message = x.try_get::<&str,String>("message").unwrap();
                let tswrite = x.try_get::<&str,String>("tswrite").unwrap();
                (message_id, writer_id, name, message, tswrite)
            }
        ).collect();
    
    return r200!{"list" => &res0[..]}
}
