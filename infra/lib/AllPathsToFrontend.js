function handler(event) {
  var req = event.request;
  var re = new RegExp('/seders/\(seder-[a-zA-Z]{6,12}/?\)?')
  req.uri = event.request.uri.replace(re, "/");
  if(req.uri === "") {
    req.uri = "/";
  }
  if(req.uri === "/seders") {
    req.uri = "/";
  }
  return req;
}