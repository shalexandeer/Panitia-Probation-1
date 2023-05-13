#![allow(unused)]

pub fn resp(code: u16, json: &str) -> warp::http::Response<String> {
    let mut s: String = "{".into();
    return warp::http::Response::builder()
        .status(code)
        .header("Content-Type", "application/json")
        .body(json.to_owned())
        .unwrap();
}

macro_rules! build_boundless_json_string {
    ($key:expr => $val:expr $(,)?) => {
        format!("{:?}:{:?}",$key,$val)
    };
    ($key0:expr => $val0:expr,$($key:expr=>$val:expr),+$(,)?) => {
        format!("{:?}:{:?},{}",$key0,$val0,build_boundless_json_string!{$($key=>$val),+})
    };
}

macro_rules! r200 {
    ($($key:expr => $val:expr),+ $(,)?) => {
        {
        let s = format!("{{{}}}",build_boundless_json_string!($($key => $val),+));
        warp::http::Response::builder()
            .status(200)
            .header("Content-Type","application/json")
            .body(s.into())
            .unwrap()
        }
    };
}
macro_rules! r400 {
    ($($key:expr => $val:expr),+ $(,)?) => {
        {
        let s = format!(r#"{{{}}}"#,build_boundless_json_string!($($key => $val),+));
        warp::http::Response::builder()
            .status(400)
            .header("Content-Type","application/json")
            .body(s.into())
            .unwrap()
        }
    };
}
macro_rules! r401 {
    ($($key:expr => $val:expr),+ $(,)?) => {
        {
        let s = format!(r#"{{{}}}"#,build_boundless_json_string!($($key => $val),+));
        warp::http::Response::builder()
            .status(401)
            .header("Content-Type","application/json")
            .body(s.into())
            .unwrap()
        }
    };
}

macro_rules! r404 {
    ($($key:expr => $val:expr),+ $(,)?) => {
        {
        let s = format!(r#"{{{}}}"#,build_boundless_json_string!($($key => $val),+));
        warp::http::Response::builder()
            .status(404)
            .header("Content-Type","application/json")
            .body(s.into())
            .unwrap()
        }
    };
}
pub(crate) use r200;
pub(crate) use r400;
pub(crate) use r401;
pub(crate) use r404;
pub(crate) use build_boundless_json_string;
