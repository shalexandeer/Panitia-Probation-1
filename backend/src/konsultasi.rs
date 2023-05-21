use std::{sync::Arc, collections::HashMap};
use hmac::Hmac;
use sha2::Sha256;

use crate::{utils::{response::*, token::UserClass}, account::{bearer_verify, bearer_verify_complete}};

pub async fn list_konsultan(
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    //id | class | isadmin | name | passwordhash | tsjoin | avataruri | blockeduntil | email | phone | address | domain | fundingform | objective
    let res0: Vec<_> = db.query(r#"
        SELECT id,name,email,phone,avataruri,tsjoin FROM account WHERE class = 'C' 
    "#, &[]).await.unwrap().iter().map(
            |x|{
                let id = x.try_get::<&str,i64>("id").unwrap();
                let name = x.try_get::<&str,String>("name").unwrap();
                let email = x.try_get::<&str,String>("email").unwrap();
                let phone = x.try_get::<&str,String>("phone").unwrap();
                let avataruri = x.try_get::<&str,String>("avataruri").unwrap();
                let tsjoin = x.try_get::<&str,String>("tsjoin").unwrap();
                (id,name,email,phone,avataruri,tsjoin)
            }
        ).collect();
    
    return r200!{"list" => &res0[..]}
}

//[GET]
pub async fn list_konsultasi(
    bearer: String,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    
    let token = if let Ok(x) = bearer_verify(&bearer, &key, &db).await{x}else{
        return r401!{
            "message" => "authentication error"
        }
    };
    // title | client | consultant | nominal | tsconsultation | tsactiveclient | tsactiveconsultant | deadline
    let res0: Vec<_> = db.query(r#"
        SELECT 
            title,
            c.name as name,
            nominal,
            tsconsultation::timestamptz(0)::text as tsc,
            tsactiveconsultant::timestamptz(0)::text as tsac,
            deadline::timestamptz(0)::text as tsd 
        FROM 
            consultation
        JOIN 
            (SELECT id,name FROM account WHERE 'class'='C') as c 
        ON
            c.id=consultant
        WHERE
            client=$1
    "#, &[&token.id]).await.unwrap().iter().map(
            |x|{
                let title = x.try_get::<&str,String>("title").unwrap();
                let name = x.try_get::<&str,String>("name").unwrap();
                let nominal = x.try_get::<&str,i64>("nominal").unwrap();
                let tsc = x.try_get::<&str,String>("tsc").unwrap();
                let tsac = x.try_get::<&str,String>("tsac").unwrap();
                let tsd = x.try_get::<&str,String>("tsd").unwrap();
                (title,name,nominal,tsc,tsac,tsd)
            }
        ).collect();
    
    //should these headers be attached?
    //Cache-Control: no-cache, no-store, must-revalidate
    //Pragma: no-cache
    //Expires: 0
    r200!{"list" => &res0[..]}
}

#[derive(Clone,PartialEq, Eq,Serialize,Deserialize)]
pub struct CreateKonsultasiParam{
    title: String,
    category: String,//expertise: String, 
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
    
    let (token,acd) = if let Ok(x) = bearer_verify_complete(&bearer, &key, &db).await{x}else{
        return r401!{
            "message" => "authentication error"
        }
    };
    if acd.class != UserClass::C{
        return r400!{
            "message" => "must be a consultant first"
        }
    }

    //check valid nominal 
    if param.nominal<0{
        return r400!{
            "message" => "nominal harus >= 0"
        }
    }
    //check valid duration 
    if param.duration<0{
        return r400!{
            "message" => "duration harus >= 0"
        }
    }

    //opt => user input 
    //imply => user has no say
    //auto => auto-fill e.g., NOW()
    // imply   | opt       | opt   | opt         | opt     | opt      | auto 
    // account | category  | title | description | nominal | duration | tscreate
    if db.query(r#"
        INSERT INTO
            consultationoffer 
        (account, category, title, description, nominal, duration)
        VALUES
            ($1, $2, $3, $4, $5, $6)
    "#, &[
            &token.id, 
            &param.category,//&param.expertise, 
            &param.title, 
            &param.description, 
            &param.nominal, 
            &param.duration
        ]).await.is_err()
    {
        return r500!{"message" => "something went wrong"}
    } 
    return r200!{"message" => "successfully created consultation offer"}
}

//#[derive(Clone,PartialEq, Eq,Serialize,Deserialize)]
//pub struct DeleteKonsultasiParam{
//    category: String,
//}

pub async fn delete_consultationoffer(
    bearer: String,
    query: HashMap<String,String>,//param: DeleteKonsultasiParam,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    
    let token = if let Ok(x) = bearer_verify(&bearer, &key, &db).await{x}else{
        return r401!{
            "message" => "authentication error"
        }
    };

    let category = if let Some(x) = query.get("category"){x}else{
        return r400!{
            "message" => "need parameter 'category'"
        }
    };
    
    if let Ok(x) = db.execute(r#"
        DELETE FROM
            consultationoffer 
        WHERE 
            account = $1 AND 
            category = $2
    "#, &[&token.id, &category]).await{
        return r200!{"message" => format!("successfully deleted {x} consultation offer if not yet. this operation will print this message if the already non-existant row is tried to be deleted")}
    }else{
        return r500!{"message" => "something went wrong"}
    }    
}

#[derive(Clone,PartialEq, Eq,Serialize,Deserialize)]
pub struct AcceptKonsultasiParam{
    consultant: i64,
    category: String
}


//[POST]accept offer 
pub async fn accept_consultationoffer(
    bearer: String,
    param: AcceptKonsultasiParam,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    
    let (token,acd) = if let Ok(x) = bearer_verify_complete(&bearer, &key, &db).await{x}else{
        return r401!{
            "message" => "authentication error"
        }
    };
    if acd.class != UserClass::U{
        return r401!{
            "message" => "use must be umkm"
        }
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
    if let Ok(x) = db.execute(r#"
        INSERT INTO 
            consultation 
        (consultant, client, title, category, nominal, deadline)
        SELECT 
            o.account, 
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
    "#, &[&token.id,&param.consultant,&param.category]).await{
        return r200!{"message" => format!("successfully deleted {x} consultation offer if not yet. this operation will print this message if the already non-existant row is tried to be deleted")}
    }else{
        return r500!{"message" => "something went wrong"}
    }    
}


//[GET]load consultation 
pub async fn load_konsultasi(
    bearer: String,
    konsultasi_id: i64,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    
    let token = if let Ok(x) = bearer_verify(&bearer, &key, &db).await{x}else{
        return r401!{
            "message" => "authentication error"
        }
    };

    // id | isclient | message | tsmessage | client | consultant
    let res0: Vec<_> = db.query(r#"
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

    "#, &[&token.id,&konsultasi_id]).await.unwrap().iter().map(
            |x|{
                let id = x.try_get::<&str,i64>("id").unwrap();
                let message = x.try_get::<&str,String>("message").unwrap();
                let is_client = x.try_get::<&str,bool>("is_client").unwrap();
                let tssent = x.try_get::<&str,String>("tssent").unwrap();
                (id,message,is_client,tssent)
            }
        ).collect();
    
    //should these headers be attached?
    //Cache-Control: no-cache, no-store, must-revalidate
    //Pragma: no-cache
    //Expires: 0
    r200!{"list" => &res0[..]}
}

#[derive(Clone,PartialEq, Eq,Serialize,Deserialize)]
pub struct WriteKonsultasiParam{
    konsultasi_id: i64,
    message: String,
}

//[POST]message consultation
pub async fn write_konsultasi(
    authorization: String,
    param: WriteKonsultasiParam,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let token = if let Ok(x) = bearer_verify(&authorization, &key, &db).await{x}else{
        return r401!{
            "message" => "authentication error"
        }
    };
    // have to check whether user is actually in the consultation
    // id | isclient | message | tsmessage | consultation_id
    if let Err(e) = db.query(r#"
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
            SELECT client=$1 AS value FROM member
        )
        INSERT INTO 
            consultationmessage 
        (consultation_id,message,isclient) 
        VALUES 
            ($2, $3, (SELECT value FROM is_client))
    "#, &[&token.id, &param.konsultasi_id,&param.message]).await{
        println!("{e:#?}");
        return r500!{
            "message" => "something has gone wrong! probably because consultation is not found"
        }
    }    
    return r200!{"list" => "sent message"}
}


