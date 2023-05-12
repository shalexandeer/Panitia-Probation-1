use rand;
use std::sync::Arc;
type JSON = std::collections::hash_map::HashMap<String, String>;

pub async fn register(data: JSON, db: Arc<tokio_postgres::Client>) -> warp::http::Response<String> {
    let username = if let Some(x) = data.get("username".into()) {
        x.clone()
    } else {
        return warp::http::Response::builder()
            .status(401)
            .header("Content-Type", "application/json")
            .body(r#"{"error":true,"message":"need fields 'username' and 'password'"}"#.to_owned())
            .unwrap();
    };
    let password = if let Some(x) = data.get("password".into()) {
        x.clone()
    } else {
        return warp::http::Response::builder()
            .status(401)
            .header("Content-Type", "application/json")
            .body(r#"{"error":true,"message":"need fields 'username' and 'password'"}"#.to_owned())
            .unwrap();
    };
    let a = argon2::Argon2::default();
    let p = password.as_bytes();
    let mut s = argon2::password_hash::SaltString::generate(&mut rand::rngs::ThreadRng::default());
    let hashed_password = argon2::PasswordHasher::hash_password(&a, p, &mut s)
        .unwrap()
        .to_string();
    let res = db
        .query(
            &format!(
                r#"
        SELECT name FROM account WHERE name = '{username}'
        "#
            ),
            &[],
        )
        .await
        .unwrap();
    if !res.is_empty() {
        return warp::http::Response::builder()
            .status(401)
            .header("Content-Type", "application/json")
            .body(r#"{"error":true,"message":"username was taken"}"#.to_owned())
            .unwrap();
    }
    // account is not in db
    db.execute(
        r#"INSERT INTO account (name, passwordhash, email, phone) VALUES ($1, $2, 'whatever@gmail.com','1231213')"#,
        &[&username, &hashed_password.as_str()],
    )
    .await
    .unwrap();
    return warp::http::Response::builder()
        .status(200)
        .header("Content-Type", "application/json")
        .body(r#"{"message"":"success"}"#.to_owned())
        .unwrap();
}
pub async fn login(data: JSON, db: Arc<tokio_postgres::Client>) -> warp::http::Response<String> {
    let username = if let Some(x) = data.get("username".into()) {
        x.clone()
    } else {
        return warp::http::Response::builder()
            .status(401)
            .header("Content-Type", "application/json")
            .body(r#"{"error":true,"message":"need fields 'username' and 'password'"}"#.to_owned())
            .unwrap();
    };
    let password = if let Some(x) = data.get("password".into()) {
        x.clone()
    } else {
        return warp::http::Response::builder()
            .status(401)
            .header("Content-Type", "application/json")
            .body(r#"{"error":true,"message":"need fields 'username' and 'password'"}"#.to_owned())
            .unwrap();
    };
    let a = argon2::Argon2::default();
    let p = password.as_bytes();
    let res = db
        .query(
            &format!(
                r#"
        SELECT passwordhash FROM account 
        WHERE name = $1
        "#
            ),
            &[&username],
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
            return warp::http::Response::builder()
                .status(200)
                .header("Content-Type", "application/json")
                .body(r#"{"message":"correct"}"#.to_owned())
                .unwrap();
        }
    }
    return warp::http::Response::builder()
        .status(404)
        .header("Content-Type", "application/json")
        .body(r#"{"error":true,"message":"something has gone wrong"}"#.to_owned())
        .unwrap();
}

pub async fn delete(data: JSON, db: Arc<tokio_postgres::Client>) -> warp::http::Response<String> {
    let username = if let Some(x) = data.get("username".into()) {
        x.clone()
    } else {
        return warp::http::Response::builder()
            .status(401)
            .header("Content-Type", "application/json")
            .body(r#"{"error":true,"message":"need fields 'username' and 'password'"}"#.to_owned())
            .unwrap();
    };
    let password = if let Some(x) = data.get("password".into()) {
        x.clone()
    } else {
        return warp::http::Response::builder()
            .status(401)
            .header("Content-Type", "application/json")
            .body(r#"{"error":true,"message":"need fields 'username' and 'password'"}"#.to_owned())
            .unwrap();
    };
    let a = argon2::Argon2::default();
    let p = password.as_bytes();
    let res = db
        .query(
            &format!(
                r#"
        SELECT passwordhash FROM account 
        WHERE name = $1
        "#
            ),
            &[&username],
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
            db.execute("DELETE FROM account WHERE name = $1", &[&username])
                .await
                .unwrap();
            return warp::http::Response::builder()
                .status(200)
                .header("Content-Type", "application/json")
                .body(r#"{"message":"correct"}"#.to_owned())
                .unwrap();
        }
    }
    return warp::http::Response::builder()
        .status(404)
        .header("Content-Type", "application/json")
        .body(r#"{"error":true,"message":"something has gone wrong"}"#.to_owned())
        .unwrap();
}

/*
*


    let username = if let Some(x) = data.get("username".into()) {
        x.clone()
    } else {
        return warp::http::Response::builder()
            .status(401)
            .header("Content-Type", "application/json")
            .body(r#"{"error":true,"message":"need fields 'username' and 'password'"}"#.to_owned())
            .unwrap();
    };
    let password = if let Some(x) = data.get("password".into()) {
        x.clone()
    } else {
        return warp::http::Response::builder()
            .status(401)
            .header("Content-Type", "application/json")
            .body(r#"{"error":true,"message":"need fields 'username' and 'password'"}"#.to_owned())
            .unwrap();
    };
    let a = argon2::Argon2::default();
    let p = password.as_bytes();
    let mut s = argon2::password_hash::SaltString::generate(&mut rand::rngs::ThreadRng::default());
    let hashed_password = argon2::PasswordHasher::hash_password(&a, p, &mut s)
        .unwrap()
        .to_string();
    let res = db
        .query(
            &format!(
                r#"
        SELECT name FROM account
        WHERE name = $1
        AND passwordhash = $2
        "#
            ),
            &[&username, &hashed_password],
        )
        .await
        .unwrap();
    if let [_, ..] = &res[..] {
        db.execute(
            r#"
            DELETE FROM account
            WHERE username = $1
            AND passwordhash = $2
            "#,
            &[&username, &hashed_password],
        )
        .await
        .unwrap();

        return warp::http::Response::builder()
            .status(200)
            .header("Content-Type", "application/json")
            .body(r#"{"message":"user deleted"}"#.to_owned())
            .unwrap();
    }
    return warp::http::Response::builder()
        .status(404)
        .header("Content-Type", "application/json")
        .body(r#"{"error":true,"message":"something has gone wrong"}"#.to_owned())
        .unwrap();




*
*/
