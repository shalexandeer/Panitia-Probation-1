use crate::{DURATION, FLASH_DURATION};
use argon2::PasswordVerifier;
use hmac::Hmac;
use rand;
use serde::{Deserialize, Deserializer};
use sha2::Sha256;
use std::sync::Arc;
type JSON = std::collections::hash_map::HashMap<String, String>;
use crate::utils::response::*;
use crate::utils::token::*;
use std::time;
const ERR_FIELD_REG: &str = "need fields 'email', 'phone', 'typ', 'username', and 'password'";
pub async fn register(
    mut data: JSON,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let phone = if let Some(x) = data.remove("phone".into()) {
        x
    } else {
        return r401! { "message" => ERR_FIELD_REG };
    };

    let username = if let Some(x) = data.remove("username".into()) {
        x
    } else {
        return r401! { "message" => ERR_FIELD_REG };
    };

    let email = if let Some(x) = data.remove("email".into()) {
        x
    } else {
        return r401! { "message" => ERR_FIELD_REG };
    };

    let password = if let Some(x) = data.remove("password".into()) {
        x
    } else {
        return r401! { "message" => ERR_FIELD_REG };
    };

    let typ: String =
        if let Some(Some(x)) = data.remove("typ".into()).map(|i| UserClass::from_str(&i)) {
            x.to_string()
        } else {
            return r401! { "message" => ERR_FIELD_REG };
        };

    let res = db
        .query(
            r#"
        SELECT email FROM account WHERE email = $1 OR phone = $2
        "#,
            &[&email, &phone],
        )
        .await
        .unwrap();
    if !res.is_empty() {
        return r401! { "message" => "email or phone number already registered" };
    }

    let a = argon2::Argon2::default();
    let p = password.as_bytes();
    let mut s = argon2::password_hash::SaltString::generate(&mut rand::rngs::ThreadRng::default());
    let hashed_password = argon2::PasswordHasher::hash_password(&a, p, &mut s)
        .unwrap()
        .to_string();

    if db
        .execute(
            r#"
        INSERT INTO account (class,email, phone, name, passwordhash) 
            VALUES ($1, $2, $3, $4, $5)
        "#,
            &[&typ, &email, &phone, &username, &hashed_password],
        )
        .await
        .is_err()
    {
        return r400! {
            "message" => "unsuccessfull registration"
        };
    };
    return r200! {
        "message" => "successfully created umkm account",
    };
}

#[derive(Deserialize, Debug)]
pub struct InfoParam {
    user_id: i64,
}

pub async fn pub_info(
    param: InfoParam,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    match db
        .query(
            r#"
        SELECT 
            id,
            class,
            isadmin,
            name,
            tsjoin::TIMESTAMPTZ(0)::TEXT,
            avataruri,
            blockeduntil::TIMESTAMPTZ(0)::TEXT,
            email,
            phone,
            address,
            domain,
            fundingform,
            objective 
        FROM 
            account 
        WHERE 
            id=$1
    "#,
            &[&param.user_id],
        )
        .await
    {
        Ok(v) => {
            if let [first, ..] = &v[..] {
                let id: i64 = first.get("id");
                let class: String = first.get("class");
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

                return r200! {
                    "id" => id,
                    "class" => class,
                    "isadmin" => isadmin,
                    "name" => name,
                    "tsjoin" => tsjoin,
                    "avataruri" => avataruri,
                    "blockeduntil" => blockeduntil,
                    "email" => email,
                    "phone" => phone,
                    "address" => address,
                    "domain" => domain,
                    "fundingform" => fundingform,
                    "objective" => objective ,
                };
            }
        }
        Err(e) => {
            println!("error: {e}");
        }
    }
    return r401! {
        "message" => "user does not exist"
    };
}

pub async fn self_info(
    bearer: String,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let token = if let Ok(t) = bearer_verify(&bearer, &key, &db).await {
        t
    } else {
        return r401! {
            "message" => "invalid token"
        };
    };

    match db
        .query(
            r#"
        SELECT 
            id,
            class,
            isadmin,
            name,
            tsjoin::TIMESTAMPTZ(0)::TEXT,
            avataruri,
            blockeduntil::TIMESTAMPTZ(0)::TEXT,
            email,
            phone,
            address,
            domain,
            fundingform,
            objective 
        FROM 
            account 
        WHERE 
            id=$1
    "#,
            &[&token.id],
        )
        .await
    {
        Ok(v) => {
            if let [first, ..] = &v[..] {
                //let id: i64 = first.get("id");
                //let class: i64 = first.get("id");
                //let isadmin: i64 = first.get("id");
                //let name: i64 = first.get("id");
                //let tsjoin: i64 = first.get("id");
                //let id: i64 = first.get("id");

                let id: i64 = first.get("id");
                let class: String = first.get("class");
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

                return r200! {
                    "id" => id,
                    "class" => class,
                    "isadmin" => isadmin,
                    "name" => name,
                    "tsjoin" => tsjoin,
                    "avataruri" => avataruri,
                    "blockeduntil" => blockeduntil,
                    "email" => email,
                    "phone" => phone,
                    "address" => address,
                    "domain" => domain,
                    "fundingform" => fundingform,
                    "objective" => objective ,
                };
            }
        }
        Err(e) => {
            println!("error: {e}");
        }
    }
    return r401! {
        "message" => "user does not exist"
    };
}

#[derive(Deserialize, Debug)]
pub struct LoginParam {
    email: String,
    password: String,
}

pub async fn login(
    data: LoginParam,
    db: Arc<tokio_postgres::Client>,
    key: Hmac<Sha256>,
) -> warp::http::Response<String> {
    let a = argon2::Argon2::default();
    let p = data.password.as_bytes();
    let res0 = db
        .query(
            r#"
        SELECT id,passwordhash FROM account 
        WHERE email = $1
    "#,
            &[&data.email],
        )
        .await
        .unwrap();

    let (id, real_password) = if let [first, ..] = &res0[..] {
        let p0: i64 = first.get("id");
        let p2: String = first.get("passwordhash");
        (p0, p2)
    } else {
        return r401! { "message" => "user with the email does not exist" };
    };

    if let Ok(()) = a.verify_password(
        p,
        &argon2::PasswordHash::parse(&real_password, argon2::password_hash::Encoding::B64).unwrap(),
    ) {
        let now = time::SystemTime::now()
            .duration_since(time::UNIX_EPOCH)
            .unwrap()
            .as_secs()
            .to_string();
        let mut claims = std::collections::BTreeMap::new();

        let id_str = id.to_string();
        //let exp = (now+DURATION).to_string();
        claims.insert("iat", now.as_str());
        claims.insert("id", id_str.as_str());

        let token = create_token(&claims, &key);
        return r200! {"token" => token};
    }
    return r404! {"message" => "failed to verify password"};
}

pub async fn delete(
    bearer: String,
    key: Hmac<Sha256>,
    db: Arc<tokio_postgres::Client>,
) -> warp::http::Response<String> {
    let token = if let Ok(t) = bearer_verify(&bearer, &key, &db).await {
        t
    } else {
        return r401! {
            "message" => "invalid token"
        };
    };

    db.execute("DELETE FROM account WHERE id = $1", &[&token.id])
        .await
        .unwrap();
    r200! {"message" => "account deleted"}
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
pub struct AccountData {
    pub id: i64,
    pub class: UserClass,
    pub isadmin: bool,
    pub name: String,
    pub tsjoin: String,
    pub avataruri: String,
    pub blockeduntil: String,
    pub email: String,
    pub phone: String,
    pub address: String,
    pub domain: String,
    pub fundingform: String,
    pub objective: String,
}

use anyhow::Result;
/// DO NOT USE FOR FLASH AUTHENTICATION. THIS DURATION IS THE LONG ONE. FLASH AUTHENTICATION NEEDS
/// SHORT-LIVED TOKENS   
///
///bearer verify that also fetches public account information
pub async fn bearer_verify_complete(
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
        if v.iat + DURATION <= now {
            anyhow::bail!("token expired")
        }
        return Ok((v, acd));
    } else {
        anyhow::bail!("user blocked")
    };
}

// DO NOT USE FOR FLASH VERIFICATION
pub async fn bearer_verify(
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
        if v.iat + DURATION <= now {
            anyhow::bail!("token expired")
        }
        return Ok(v);
    } else {
        anyhow::bail!("user blocked")
    };
}


