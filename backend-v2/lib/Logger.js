class Logger {
  static prefix() {
    return 'mlnlog';
  }
  static log({proc, cons, roomCode, gameName, message, status, event, ob}) {
    try {
      proc = proc || process;
      cons = cons || console;
      if(proc && proc.env && proc.env.NODE_ENV === 'test') return;
      if(!cons || !cons.log) return;
      cons.log(
          this.prefix(),
          roomCode ? roomCode : '*',
          gameName ? gameName : '*',
          event ? event : '*',
          status ? status : '*',
          message ? message : '*',
          ob ? ob : '*'
      );
    } catch(e) {
      return;
    }
  }
}
module.exports = Logger;