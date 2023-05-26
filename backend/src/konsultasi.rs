use futures_util::{stream::iter, Stream, StreamExt};
use crate::FLASH_DURATION;
use std::time;
use hmac::Hmac;
use sha2::Sha256;
use std::{
    collections::{BTreeMap, HashMap},
    convert::Infallible,
    sync::Arc,
};
use tokio::sync::Mutex;
use tokio_stream::wrappers::UnboundedReceiverStream;
use warp::{sse::Event, Filter, Reply};

use crate::{
    account::{bearer_verify, bearer_verify_complete},
    konsultasi,
    utils::{response::*, token::UserClass},
    Chats,
};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Message {
    pub user_id: i64,
    pub message: String,
    pub timestamptz: String,
}
//use hyper::body::Bytes;
//impl Into<Bytes> for Message{
//    fn into(self) -> Bytes {
//        let tmp = serde_json::to_string(&self).unwrap();
//        let tmp2: &str = serde_json::to_string(&self).as_ref().unwrap();
//        Bytes::from_static(tmp2.as_bytes())
//    }
//}
//
//impl From<Bytes> for Message{
//    fn from(value: Bytes) -> Self {
//        let bytes: &[u8] = &value.to_vec();
//        let s: &str = std::str::from_utf8(bytes).unwrap();
//        serde_json::from_str(s).unwrap()
//    }
//}

pub async fn list_konsultan(db: Arc<tokio_postgres::Client>) -> warp::http::Response<String> {
    //id | class | isadmin | name | passwordhash | tsjoin | avataruri | blockeduntil | email | phone | address | domain | fundingform | objective
    let res0: Vec<_> = db
        .query(
            r#"
        SELECT id,name,email,phone,avataruri,tsjoin::TIMESTAMPTZ(0)::TEXT FROM account WHERE class = 'C' 
    "#,
            &[],
        )
        .await
        .unwrap()
        .iter()
        .map(|x| {
            let id = x.try_get::<&str, i64>("id").unwrap();
            let name = x.try_get::<&str, String>("name").unwrap();
            let email = x.try_get::<&str, String>("email").unwrap();
            let phone = x.try_get::<&str, String>("phone").unwrap();
            let avataruri = x.try_get::<&str, String>("avataruri").unwrap();
            let tsjoin = x.try_get::<&str, String>("tsjoin").unwrap();
            (id, name, email, phone, avataruri, tsjoin)
        })
        .collect();

    return r200! {"list" => &res0[..]};
}

//[GET]
pub async fn list_konsultasi(
    bearer: String,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let token = if let Ok(x) = bearer_verify(&bearer, &key, &db).await {
        x
    } else {
        return r401! {
            "message" => "authentication error"
        };
    };
    // title | client | consultant | nominal | tsconsultation | tsactiveclient | tsactiveconsultant | deadline
    let res0: Vec<_> = db
        .query(
            r#"
        SELECT 
            consultation.id,
            title,
            c.name as name,
            nominal,
            tsconsultation::timestamptz(0)::text as tsc,
            tsactiveconsultant::timestamptz(0)::text as tsac,
            deadline::timestamptz(0)::text as tsd 
        FROM 
            consultation
        JOIN 
            (SELECT id,name FROM account WHERE class='C') as c 
        ON
            c.id=consultant
        WHERE
            client=$1
        OR 
            consultant=$1
    "#,
            &[&token.id],
        )
        .await
        .unwrap()
        .iter()
        .map(|x| {
            let id = x.try_get::<&str, i64>("id").unwrap();
            let title = x.try_get::<&str, String>("title").unwrap();
            let name = x.try_get::<&str, String>("name").unwrap();
            let nominal = x.try_get::<&str, i64>("nominal").unwrap();
            let tsc = x.try_get::<&str, String>("tsc").unwrap();
            let tsac = x.try_get::<&str, String>("tsac").unwrap();
            let tsd = x.try_get::<&str, String>("tsd").unwrap();
            (id, title, name, nominal, tsc, tsac, tsd)
        })
        .collect();

    //should these headers be attached?
    //Cache-Control: no-cache, no-store, must-revalidate
    //Pragma: no-cache
    //Expires: 0
    r200! {"list" => &res0[..]}
}

#[derive(Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct CreateKonsultasiParam {
    title: String,
    category: String, //expertise: String,
    description: String,
    nominal: i64,
    duration: i64, //seconds
}

pub async fn create_consultationoffer(
    bearer: String,
    param: CreateKonsultasiParam,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let (token, acd) = if let Ok(x) = bearer_verify_complete(&bearer, &key, &db).await {
        x
    } else {
        return r401! {
            "message" => "authentication error"
        };
    };
    if acd.class != UserClass::C {
        return r400! {
            "message" => "must be a consultant first"
        };
    }

    //check valid nominal
    if param.nominal < 0 {
        return r400! {
            "message" => "nominal harus >= 0"
        };
    }
    //check valid duration
    if param.duration < 0 {
        return r400! {
            "message" => "duration harus >= 0"
        };
    }

    //opt => user input
    //imply => user has no say
    //auto => auto-fill e.g., NOW()
    // imply   | opt       | opt   | opt         | opt     | opt      | auto
    // account | category  | title | description | nominal | duration | tscreate
    if db
        .query(
            r#"
        INSERT INTO
            consultationoffer 
        (account, category, title, description, nominal, duration)
        VALUES
            ($1, $2, $3, $4, $5, $6)
    "#,
            &[
                &token.id,
                &param.category, //&param.expertise,
                &param.title,
                &param.description,
                &param.nominal,
                &param.duration,
            ],
        )
        .await
        .is_err()
    {
        return r500! {"message" => "something went wrong"};
    }
    return r200! {"message" => "successfully created consultation offer"};
}

//#[derive(Clone,PartialEq, Eq,Serialize,Deserialize)]
//pub struct DeleteKonsultasiParam{
//    category: String,
//}

pub async fn delete_consultationoffer(
    bearer: String,
    query: HashMap<String, String>, //param: DeleteKonsultasiParam,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let token = if let Ok(x) = bearer_verify(&bearer, &key, &db).await {
        x
    } else {
        return r401! {
            "message" => "authentication error"
        };
    };

    let category = if let Some(x) = query.get("category") {
        x
    } else {
        return r400! {
            "message" => "need parameter 'category'"
        };
    };

    if let Ok(x) = db
        .execute(
            r#"
        DELETE FROM
            consultationoffer 
        WHERE 
            account = $1 AND 
            category = $2
    "#,
            &[&token.id, &category],
        )
        .await
    {
        return r200! {"message" => format!("successfully deleted {x} consultation offer if not yet. this operation will print this message if the already non-existant row is tried to be deleted")};
    } else {
        return r500! {"message" => "something went wrong"};
    }
}

pub async fn list_consultationoffer(
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {

    if let Ok(rows) = db.query(
        "SELECT id,account,category,title,description,nominal,duration,tscreate::TIMESTAMPTZ(0)::TEXT from consultationoffer", 
    &[]).await{
        let tmp: Vec<_> = rows.iter().map(|r|{
            let id = r.try_get::<&str,i64>("id").unwrap();
            let account = r.try_get::<&str,i64>("account").unwrap();
            let category = r.try_get::<&str,&str>("category").unwrap();
            let title = r.try_get::<&str,&str>("title").unwrap();
            let description = r.try_get::<&str,&str>("description").unwrap();
            let nominal = r.try_get::<&str,i64>("nominal").unwrap();
            let duration = r.try_get::<&str,i64>("duration").unwrap();
            let tscreate = r.try_get::<&str,&str>("tscreate").unwrap();
            (id,account,category,title,description,nominal,duration,tscreate)
        }).collect();
        return r200!{
            "list" => &tmp[..]
        }
    }
    return r500!{
        "message" => "something went wrong"
    }
}



#[derive(Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AcceptKonsultasiParam {
    consultant: i64,
    category: String,
}

//[POST]accept offer
pub async fn accept_consultationoffer(
    bearer: String,
    param: AcceptKonsultasiParam,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let (token, acd) = if let Ok(x) = bearer_verify_complete(&bearer, &key, &db).await {
        x
    } else {
        return r401! {
            "message" => "authentication error"
        };
    };
    if acd.class != UserClass::U {
        return r401! {
            "message" => "use must be umkm"
        };
    }

    // consultationoffer
    // account | category | title | description | nominal | duration | tscreate

    // consultation
    // title | category | client | consultant | nominal | tsconsultation | tsactiveclient | tsactiveconsultant | deadline

    // account => consultant
    // category => category
    // title => title
    // description => description
    // nominal => nominal
    // now()+duration => deadline
    match db
        .execute(
            r#"
        INSERT INTO 
            consultation 
        (consultant, description, client, title, category, nominal, deadline)
        SELECT 
            o.account, 
            o.description,
            $1, 
            o.title,
            o.category,
            o.nominal,
            NOW()+o.duration * interval '1 sec'
        FROM 
            consultationoffer AS o
            JOIN 
                account as a
            ON 
                a.id=o.account
            WHERE 
                a.class='C'
            AND 
                o.account=$2 
            AND 
                o.category=$3
    "#,
            &[&token.id, &param.consultant, &param.category],
        )
        .await
    {
        Ok(x) => {
            return r200! {
                "message" => format!("successfully deleted {x} consultation offer if not yet. this operation will print this message if the already non-existant row is tried to be deleted"),
                "n" => x
            }
        }
        Err(e) => {
            dbg!(e);
            return r500! {"message" => "something went wrong"};
        }
    }
}

//[GET]load consultation
pub async fn load_konsultasi(
    bearer: String,
    konsultasi_id: i64,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let token = if let Ok(x) = bearer_verify(&bearer, &key, &db).await {
        x
    } else {
        return r401! {
            "message" => "authentication error"
        };
    };

    // id | isclient | message | tsmessage | client | consultant
    let res0: Vec<_> = db
        .query(
            r#"
        SELECT 
            m.id as id,
            m.isclient as is_client,
            m.message as message,
            m.tsmessage::timestamptz(0)::text as tssent
        FROM 
            consultationmessage m
        JOIN 
            consultation c
        ON 
            m.consultation_id=c.id
        WHERE
            (c.client=$1
        OR 
            c.consultant=$1)
        AND 
            m.consultation_id=$2

    "#,
            &[&token.id, &konsultasi_id],
        )
        .await
        .unwrap()
        .iter()
        .map(|x| {
            let id = x.try_get::<&str, i64>("id").unwrap();
            let message = x.try_get::<&str, String>("message").unwrap();
            let is_client = x.try_get::<&str, bool>("is_client").unwrap();
            let tssent = x.try_get::<&str, String>("tssent").unwrap();
            (id, message, is_client, tssent)
        })
        .collect();

    //should these headers be attached?
    //Cache-Control: no-cache, no-store, must-revalidate
    //Pragma: no-cache
    //Expires: 0
    r200! {"list" => &res0[..]}
}

#[derive(Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct WriteKonsultasiParam {
    konsultasi_id: i64,
    message: String,
}

//[POST]message consultation
pub async fn write_konsultasi(
    authorization: String,
    param: WriteKonsultasiParam,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
    chats: Arc<Mutex<Chats>>,
) -> warp::http::Response<String> {
    let token = if let Ok(x) = bearer_verify(&authorization, &key, &db).await {
        x
    } else {
        return r401! {
            "message" => "authentication error"
        };
    };
    // have to check whether user is actually in the consultation
    // id | isclient | message | tsmessage | consultation_id
    if let Err(e) = db
        .query(
            r#"
        WITH member AS (
            SELECT
                acc.id AS id, c.client AS client
            FROM 
                account acc
            JOIN 
                consultation c
            ON 
                c.id=$2
            WHERE
                c.client = $1
            OR 
                c.consultant = $1
        ), is_client AS (
            SELECT client=$1 AS value FROM member GROUP BY value
        )
        INSERT INTO 
            consultationmessage 
        (consultation_id,message,isclient) 
        VALUES 
            ($2, $3, (SELECT value FROM is_client))
    "#,
            &[&token.id, &param.konsultasi_id, &param.message],
        )
        .await
    {
        println!("{e:#?}");
        return r500! {
            "message" => "something has gone wrong! probably because consultation is not found"
        };
    }
    let mut chat = chats.lock().await;
    chat.0.get_mut(&param.konsultasi_id).map(|x| {
        x.0.retain(|&k, v| {
            if k == token.id {
                return true;
            }
            v.send(Message {
                user_id: token.id,
                message: param.message.clone(),
                timestamptz: String::from("NOT_IMPLEMENTED"),
            })
            .is_ok()
        })
    });
    //if let Some(Some(v)) = x{
    //    v.send
    //}
    return r200! {"list" => "sent message"};
}

pub async fn flash_auth(
    bearer: String,
    key: Hmac<Sha256>,
    flash_key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String>  {
    if let Ok(x) = bearer_verify(&bearer, &key, &db).await {
        let now = time::SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap().as_secs().to_string(); 
        let mut claims = std::collections::BTreeMap::new();

        let id_str = x.id.to_string();
        claims.insert("iat", now.as_str());
        claims.insert("id", id_str.as_str());

        let token = create_token(&claims, &flash_key);
        return r200!{"token" => token};
    } 
    r401!{
        "message" => "failed to authenticate",
    }
}


use crate::UserSender;
use tokio::sync::mpsc::*;
pub async fn live_chat(
    konsultasi_id: i64,
    query: HashMap<String, String>,
    flash_key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
    chats: Arc<Mutex<Chats>>,
) -> impl Reply {
    let (sender, receiver) = unbounded_channel::<konsultasi::Message>();
    let mut receiver = UnboundedReceiverStream::new(receiver);
    let mut id = 0;
    let bearer: String = if let Some(x)=query.get("token".into()){x.clone()}else{
        String::from("invalid")
    };
    if let Ok(x) = flash_bearer_verify(&bearer, &flash_key, &db).await {
        id = x.id;
        let mut tmp = chats.lock().await;
        if let None = tmp.0.get(&konsultasi_id) {
            tmp.0.insert(konsultasi_id, UserSender(BTreeMap::new()));
        }
        if let None = tmp.0.get(&konsultasi_id).unwrap().0.get(&id) {
            tmp.0.get_mut(&konsultasi_id).unwrap().0.insert(id, sender);
        };
    } else {
        receiver.close();
    };

    let stream = receiver.map(move |msg| {
        return Ok::<_, Infallible>(
            Event::default()
                .event("receive")
                .data(serde_json::to_string(&msg).unwrap()),
        );
    });
    warp::sse::reply(warp::sse::keep_alive().stream(stream))
}


use anyhow::Result;
use crate::utils::token::*;
use crate::account::AccountData;
/// flash version of `bearer_verify_complete`
pub async fn flash_bearer_verify_complete(token: &str, key: &Hmac<Sha256>, db: &Arc<tokio_postgres::Client>)->Result<(TokenData,AccountData)>{
    let token = if let Some(t) = token.strip_prefix("Bearer "){t} else {
        token
    };
    let v = verify_token(&token, &key)?;
    //class,isadmin,name,tsjoin,avataruri,blockeduntil,email,phone,address,domain,fundingform,objective

    let tmp = db.query(r#"
    SELECT 
        id,
        class,
        isadmin,
        name,
        tsjoin::timestamptz(0)::text,
        avataruri,
        blockeduntil::timestamptz(0)::text,
        email,
        phone,
        address,
        domain,
        fundingform,
        objective 
    FROM 
        account 
    WHERE 
        blockeduntil<=NOW() AND id=$1
    "#, &[&v.id]).await.unwrap();
    if let [first, ..] = &tmp[..]{
        let class = first.try_get::<&str,&str>("class").map(UserClass::from_str).unwrap().unwrap();
        let isadmin = first.try_get::<&str,bool>("isadmin").unwrap();
        let name = first.try_get::<&str,String>("name").unwrap();
        let tsjoin = first.try_get::<&str,String>("tsjoin").unwrap();
        let avataruri = first.try_get::<&str,String>("avataruri").unwrap();
        let blockeduntil = first.try_get::<&str,String>("blockeduntil").unwrap();
        let email = first.try_get::<&str,String>("email").unwrap();
        let phone = first.try_get::<&str,String>("phone").unwrap();
        let address = first.try_get::<&str,String>("address").unwrap();
        let domain = first.try_get::<&str,String>("domain").unwrap();
        let fundingform = first.try_get::<&str,String>("fundingform").unwrap();
        let objective = first.try_get::<&str,String>("objective").unwrap();
        let acd = AccountData{
            id: v.id,
            class,
            isadmin,
            name,
            tsjoin,
            avataruri,
            blockeduntil,
            email,
            phone,
            address,
            domain,
            fundingform,
            objective,
        };
        let now = time::SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap().as_secs(); 
        if v.iat+FLASH_DURATION<=now{
            anyhow::bail!("token expired")
        }
        return Ok((v,acd));
    } else {
        anyhow::bail!("user blocked")
    };
} 

/// flash version of `bearer_verify`
pub async fn flash_bearer_verify(token: &str, key: &Hmac<Sha256>, db: &Arc<tokio_postgres::Client>)->Result<TokenData>{
    let token = if let Some(t) = token.strip_prefix("Bearer "){t} else {
        token
    };
    let v = verify_token(&token, &key)?;
    //class,isadmin,name,tsjoin,avataruri,blockeduntil,email,phone,address,domain,fundingform,objective

    let tmp = db.query(r#"
    SELECT 
        id
    FROM 
        account 
    WHERE 
        blockeduntil<=NOW() AND id=$1
    "#, &[&v.id]).await.unwrap();
    if let [_, ..] = &tmp[..]{
        let now = time::SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap().as_secs(); 
        if v.iat+FLASH_DURATION<=now{
            anyhow::bail!("token expired")
        }
        return Ok(v);
    } else {
        anyhow::bail!("user blocked")
    };
} 

