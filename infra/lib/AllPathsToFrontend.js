function handler(event) {
  var req = event.request;
  var re = new RegExp('/seders/[a-zA-Z]+')
  req.uri = event.request.uri.replace(re, "");
  if(req.uri === "") {
    req.uri = "/";
  }
  return req;
}