use hmac::Hmac;
use sha2::Sha256;
use jwt::SignWithKey;
use jwt::VerifyWithKey;
use std::collections::BTreeMap;
use anyhow::Result;

#[derive(Debug,Clone,Copy,Hash,PartialEq,Eq,Deserialize,Serialize)]
pub enum UserClass{
    I, // Investor
    C, // Consultant
    U, // UMKM
}

impl UserClass{
    pub fn to_string(&self) -> String {
        use UserClass::*;
        match self{
            I => 'I',
            C => 'C',
            U => 'U'
        }.into()
    }
    pub fn to_char(&self) -> char {
        use UserClass::*;
        match self{
            I => 'I',
            C => 'C',
            U => 'U'
        }
    }
    pub fn from_str(s:&str) -> Option<Self>{
        use UserClass::*;
        match s{
            "I" => Some(I),
            "C" => Some(C),
            "U" => Some(U),
            _ => None
        }
    }
    pub fn from_char(c:char) -> Option<Self>{
        use UserClass::*;
        match c{
            'I' => Some(I),
            'C' => Some(C),
            'U' => Some(U),
            _ => None
        }
    }
}
#[derive(Debug,Clone,Copy,Hash,PartialEq,Eq,Deserialize,Serialize)]
pub struct TokenData{
    pub id: i64,
    pub iat: u64,
}

pub fn create_token(data: &BTreeMap<&str, &str>, key: &Hmac<Sha256>) -> String {
    data.sign_with_key(key).unwrap()
}

pub fn verify_token(token: &str, key: &Hmac<Sha256>) -> Result<TokenData> {
    token
        .verify_with_key(key)
        .or_else(|_|Err(anyhow::anyhow!("unverified token")))
        .and_then(|x|btree2tokdata(x))
}

fn btree2tokdata(mut bt: BTreeMap<String, String>) -> Result<TokenData>{
    let id: i64 = bt.remove("id").ok_or(anyhow::anyhow!("need field 'id'"))?.parse()?;
    let iat: u64 = bt.remove("iat").ok_or(anyhow::anyhow!("need field 'iat'"))?.parse()?;
    Ok(TokenData{
        id,
        iat,
    })
}
