use hmac::Hmac;
use rand;
use sha2::Sha256;
use std::sync::Arc;
type JSON = std::collections::hash_map::HashMap<String, String>;
use crate::utils::response::*;
use crate::utils::token::*;
use std::time;

pub async fn register(data: JSON, db: Arc<tokio_postgres::Client>) -> warp::http::Response<String> {
    let email = if let Some(x) = data.get("email".into()) {
        x.clone()
    } else {
        return r401!{ "message" => "need fields 'email', 'username' and 'password'" };
    };

    let username = if let Some(x) = data.get("username".into()) {
        x.clone()
    } else {
        return r401!{ "message" => "need fields 'email', 'username' and 'password'" };
    };

    let password = if let Some(x) = data.get("password".into()) {
        x.clone()
    } else {
        return r401!{ "message" => "need fields 'email', 'username' and 'password'" };
    };
    let res = db
        .query(
            r#"
        SELECT email FROM account WHERE email = $1
        "#,
            &[&email],
        )
        .await
        .unwrap();
    if !res.is_empty() {
        return r401! { "message" => "email already registered" } ;
    }

    let a = argon2::Argon2::default();
    let p = password.as_bytes();
    let mut s = argon2::password_hash::SaltString::generate(&mut rand::rngs::ThreadRng::default());
    let hashed_password = argon2::PasswordHasher::hash_password(&a, p, &mut s)
        .unwrap()
        .to_string();

    db.execute(
        r#"INSERT INTO account (name, passwordhash, email, phone) VALUES ($1, $2, $3, '1231213')"#,
        &[&username, &hashed_password.as_str(), &email],
    )
    .await
    .unwrap();
    r200!{
        "message" => "success",
        "yes" => "yabol!!!",
    }
}
pub async fn login(
    data: JSON,
    db: Arc<tokio_postgres::Client>,
    key: Hmac<Sha256>,
) -> warp::http::Response<String> {
    let email = if let Some(x) = data.get("email".into()) {
        x.clone()
    } else {
        return r401!{ "message" => "need fields 'email' and 'password'" };
    };
    let password = if let Some(x) = data.get("password".into()) {
        x.clone()
    } else {
        return r401!{ "message" => "need fields 'email' and 'password'" };
    };
    let a = argon2::Argon2::default();
    let p = password.as_bytes();
    let res = db
        .query(
            r#"
        SELECT id, passwordhash FROM account 
        WHERE email = $1
        "#,
            &[&email],
        )
        .await
        .unwrap();
    if let [first, ..] = &res[..] {
        use argon2::PasswordVerifier;
        let pw = first.try_get::<&str, &str>("passwordhash").unwrap();
        if let Ok(_) = a.verify_password(
            p,
            &argon2::PasswordHash::parse(&pw, argon2::password_hash::Encoding::B64).unwrap(),
        ) {
            let now = time::SystemTime::now().duration_since(time::UNIX_EPOCH).unwrap().as_secs(); 
            const DURATION: u64 = 60*60*2;
            let mut claims = std::collections::BTreeMap::new();

            let exp = (now+DURATION).to_string();
            claims.insert("exp", exp.as_str());
            claims.insert("exp", exp.as_str());

            let token = create_token(&claims, &key);
            return r200!{"token" => token};
        }
    }
    return r404!{"message" => "something has gone wrong"}
}

pub async fn delete(data: JSON, db: Arc<tokio_postgres::Client>) -> warp::http::Response<String> {
    let email = if let Some(x) = data.get("email".into()) {
        x.clone()
    } else {
        return r401!{ "message" => "need fields 'email' and 'password'" };
    };
    let password = if let Some(x) = data.get("password".into()) {
        x.clone()
    } else {
        return r401!{ "message" => "need fields 'email' and 'password'" };
    };
    let a = argon2::Argon2::default();
    let p = password.as_bytes();
    let res = db
        .query(
            &format!(
                r#"
        SELECT passwordhash FROM account 
        WHERE email = $1
        "#
            ),
            &[&email],
        )
        .await
        .unwrap();
    if let [first, ..] = &res[..] {
        use argon2::PasswordVerifier;
        let pw = first.try_get::<&str, &str>("passwordhash").unwrap();
        if let Ok(_) = a.verify_password(
            p,
            &argon2::PasswordHash::parse(&pw, argon2::password_hash::Encoding::B64).unwrap(),
        ) {
            db.execute("DELETE FROM account WHERE email = $1", &[&email])
                .await
                .unwrap();
            return r200!{"message" => "account deleted"};
        }
    }
    r404!{"message" => "something has gone wrong"}
}

pub async fn verify(
    data: JSON,
    key: Hmac<Sha256>,
) -> warp::http::Response<String> {
    let token = if let Some(x) = data.get("token".into()) {
        x.clone()
    } else {
        return r401!{"message" => "need fields 'token'"};
    };
    if let Ok(v) = verify_token(&token, &key){
        return r200!{
            "message" => "correct!",
            "debug" => v
        }
    }
    return r401!{"message" => "invalid token",}
}


