use warp::*;
pub fn with_state<T>(
    state: T,
) -> impl Filter<Extract = (T,), Error = std::convert::Infallible> + Clone where T: Clone + Send {
    warp::any().map(move || state.clone())
}
