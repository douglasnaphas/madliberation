const responses = {
  BAD_REQUEST: {err: 'bad request'},
  SERVER_ERROR: {err: 'server error'},
  FORBIDDEN: {err: 'forbidden'},
  success: (data) => {return {...data, result: 'success'}}
}

module.exports = responses;