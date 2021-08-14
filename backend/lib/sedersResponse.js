const sedersResponse = () => {
  const middleware = (req, res, next) => {
    const data = res.locals.dbDataSeders;
    if(data) {
      if(Array.isArray(data.Items)) {
        for(let i = 0; i < data.Items.length; i++) {
          if(data.Items[i].session_key) {
            data.Items[i].session_key = undefined;
          }
        }
      }
      return res.send(data);
    }
    throw {
      message: `sedersResponse: no data`,
      dbErrorSeders: res.locals.dbErrorSeders,
      dbError: res.locals.dbError,
      dbData: res.loals.dbData
    }
  };
  return middleware;
}
module.exports = sedersResponse;