use hmac::Hmac;
use sha2::Sha256;
use jwt::SignWithKey;
use jwt::VerifyWithKey;
use std::collections::BTreeMap;
use anyhow::Result;

//feeling like deleting these 1 liners

pub fn create_token(data: &BTreeMap<&str, &str>, key: &Hmac<Sha256>) -> String {
    data.sign_with_key(key).unwrap()
}

pub fn verify_token(token: &str, key: &Hmac<Sha256>) -> Result<BTreeMap<String,String>> {
    token.verify_with_key(key).or_else(|_|anyhow::bail!("unverified token"))
}
