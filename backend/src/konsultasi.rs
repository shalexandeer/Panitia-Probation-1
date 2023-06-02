use crate::FLASH_DURATION;
use futures_util::{stream::iter, Stream, StreamExt};
use hmac::Hmac;
use postgres_types::{FromSql, ToSql};
use sha2::Sha256;
use std::time;
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

#[derive(Debug, Clone, Deserialize, Serialize, FromSql, ToSql)]
pub struct Konsultan {
    id: i64,
    name: String,
    email: String,
    phone: String,
    avataruri: String,
    tsjoin: String,
}
pub async fn list_konsultan(db: Arc<tokio_postgres::Client>) -> warp::http::Response<String> {
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
            let id: i64 = x.get("id");
            let name: String = x.get("name");
            let email: String = x.get("email");
            let phone: String = x.get("phone");
            let avataruri: String = x.get("avataruri");
            let tsjoin: String = x.get("tsjoin");
            Konsultan{id, name, email, phone, avataruri, tsjoin}
        })
        .collect();

    return r200! {"list" => &res0[..]};
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Konsultasi {
    id: i64,
    title: String,
    name: String,
    konsultan_id: i64,
    nominal: i64,
    tsc: String,
    tsac: String,
    tsd: String,
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
    let res0: Vec<_> = db
        .query(
            r#"
        SELECT 
            consultation.id,
            consultation.consultant as konsultan_id,
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
            let id: i64 = x.get("id");
            let title: String = x.get("title");
            let name: String = x.get("name");
            let nominal: i64 = x.get("nominal");
            let tsc: String = x.get("tsc");
            let tsac: String = x.get("tsac");
            let konsultan_id: i64 = x.get("konsultan_id");
            let tsd: String = x.get("tsd");
            Konsultasi {
                id,
                konsultan_id,
                title,
                name,
                nominal,
                tsc,
                tsac,
                tsd,
            }
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
    match db
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
    {
        Ok(x) => {
            return r200! {"message" => "successfully created consultation offer"};
        }
        Err(x) => {
            println!("error: {x:#?}");
            return r500! {"message" => "something went wrong. maybe this consultationoffer has already been created?"};
        }
    }
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
    //https://dba.stackexchange.com/questions/267243/want-to-delete-then-insert-with-single-statement-using-a-cte-in-postgres
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

#[derive(Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConsultationOffer {
    id: i64,
    account: i64,
    category: String,
    title: String,
    description: String,
    nominal: i64,
    duration: i64,
    tscreate: String,
}
pub async fn list_consultationoffer(
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    if let Ok(rows) = db.query(
        "SELECT id,account,category,title,description,nominal,duration,tscreate::TIMESTAMPTZ(0)::TEXT from consultationoffer", 
    &[]).await{
        let tmp: Vec<_> = rows.iter().map(|r|{
            let id: i64 = r.get("id");
            let account: i64 = r.get("account");
            let category: String = r.get("category");
            let title: String = r.get("title");
            let description: String = r.get("description");
            let nominal: i64 = r.get("nominal");
            let duration: i64 = r.get("duration");
            let tscreate: String = r.get("tscreate");
            ConsultationOffer{id,account,category,title,description,nominal,duration,tscreate}
        }).collect();
        return r200!{
            "list" => &tmp[..]
        }
    }
    return r500! {
        "message" => "something went wrong"
    };
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

#[derive(Serialize)]
pub struct ConsultationMessage {
    id: i64,
    message: String,
    is_client: bool,
    tssent: String,
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
            let id: i64 = x.get("id");
            let message: String = x.get("message");
            let is_client: bool = x.get("is_client");
            let tssent: String = x.get("tssent");
            ConsultationMessage {
                id,
                message,
                is_client,
                tssent,
            }
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
            let tmp = v.send(Message {
                user_id: token.id,
                message: param.message.clone(),
                timestamptz: String::from("NOT_IMPLEMENTED"),
            });
            println!(
                "user: {k} | message = {} | ok = {}",
                param.message.clone(),
                tmp.is_ok()
            );
            return tmp.is_ok();
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
) -> warp::http::Response<String> {
    if let Ok(x) = bearer_verify(&bearer, &key, &db).await {
        let now = time::SystemTime::now()
            .duration_since(time::UNIX_EPOCH)
            .unwrap()
            .as_secs()
            .to_string();
        let mut claims = std::collections::BTreeMap::new();

        let id_str = x.id.to_string();
        claims.insert("iat", now.as_str());
        claims.insert("id", id_str.as_str());

        let token = create_token(&claims, &flash_key);
        return r200! {"token" => token};
    }
    r401! {
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
    let bearer: String = if let Some(x) = query.get("token".into()) {
        println!("token ok");
        x.clone()
    } else {
        String::from("invalid")
    };
    if let Ok(x) = flash_bearer_verify(&bearer, &flash_key, &db).await {
        println!("bearer verified");
        id = x.id;
        let mut tmp = chats.lock().await;
        if let None = tmp.0.get(&konsultasi_id) {
            println!("new chat");
            tmp.0.insert(konsultasi_id, UserSender(BTreeMap::new()));
        } else {
            println!("chat already exists");
        }

        if let Some(x) = tmp.0.get_mut(&konsultasi_id).unwrap().0.insert(id, sender) {
            println!("closing old connection");
            x.closed().await
        } else {
            println!("no old connection");
        }
    } else {
        println!("unverified {bearer}...closing!");
        receiver.close();
    };

    let stream = receiver.map(move |msg| {
        println!("returning stream with message = {}", msg.message);
        return Ok::<_, Infallible>(
            Event::default()
                .event("receive")
                .data(serde_json::to_string(&msg).unwrap()),
        );
    });
    warp::sse::reply(warp::sse::keep_alive().stream(stream))
}

use crate::account::AccountData;
use crate::utils::token::*;
use anyhow::Result;
/// flash version of `bearer_verify_complete`
pub async fn flash_bearer_verify_complete(
    token: &str,
    key: &Hmac<Sha256>,
    db: &Arc<tokio_postgres::Client>,
) -> Result<(TokenData, AccountData)> {
    let token = if let Some(t) = token.strip_prefix("Bearer ") {
        t
    } else {
        token
    };
    let v = verify_token(&token, &key)?;
    //class,isadmin,name,tsjoin,avataruri,blockeduntil,email,phone,address,domain,fundingform,objective

    let tmp = db
        .query(
            r#"
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
    "#,
            &[&v.id],
        )
        .await
        .unwrap();
    if let [first, ..] = &tmp[..] {
        let class = first
            .try_get::<&str, &str>("class")
            .map(UserClass::from_str)
            .unwrap()
            .unwrap();
        let isadmin: bool = first.get("isadmin");
        let name: String = first.get("name");
        let tsjoin: String = first.get("tsjoin");
        let avataruri: String = first.get("avataruri");
        let blockeduntil: String = first.get("blockeduntil");
        let email: String = first.get("email");
        let phone: String = first.get("phone");
        let address: String = first.get("address");
        let domain: String = first.get("domain");
        let fundingform: String = first.get("fundingform");
        let objective: String = first.get("objective");
        let acd = AccountData {
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
        let now = time::SystemTime::now()
            .duration_since(time::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        if v.iat + FLASH_DURATION <= now {
            anyhow::bail!("token expired")
        }
        return Ok((v, acd));
    } else {
        anyhow::bail!("user blocked")
    };
}

/// flash version of `bearer_verify`
pub async fn flash_bearer_verify(
    token: &str,
    key: &Hmac<Sha256>,
    db: &Arc<tokio_postgres::Client>,
) -> Result<TokenData> {
    let token = if let Some(t) = token.strip_prefix("Bearer ") {
        t
    } else {
        token
    };
    let v = verify_token(&token, &key)?;
    //class,isadmin,name,tsjoin,avataruri,blockeduntil,email,phone,address,domain,fundingform,objective

    let tmp = db
        .query(
            r#"
    SELECT 
        id
    FROM 
        account 
    WHERE 
        blockeduntil<=NOW() AND id=$1
    "#,
            &[&v.id],
        )
        .await
        .unwrap();
    if let [_, ..] = &tmp[..] {
        let now = time::SystemTime::now()
            .duration_since(time::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        if v.iat + FLASH_DURATION <= now {
            anyhow::bail!("token expired")
        }
        return Ok(v);
    } else {
        anyhow::bail!("user blocked")
    };
}
