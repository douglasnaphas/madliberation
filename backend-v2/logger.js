const logger = {
  log: msg => {
    if(process && process.env && process.env.NODE_ENV !== 'test') {
      console.log(msg);
    }
  }
};
module.exports = logger;