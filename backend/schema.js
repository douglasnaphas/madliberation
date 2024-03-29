/**
 * Contains various information about the database schema, such as attribute
 * names.
 *
 * See https://github.com/douglasnaphas/madliberation/wiki/Database-schema.
 */
const schema = {
  TABLE_NAME: process && process.env && process.env["TABLE_NAME"],
  SEPARATOR: "#",
  // key attribute names
  PARTITION_KEY: "room_code",
  SORT_KEY: "lib_id",
  // partition key prefix(es)
  PKEY_PREFIX_SUB: "sub-",
  // relating to the compound sort key
  SEDER_PREFIX: "seder",
  PARTICIPANT_PREFIX: "participant",
  SCRIPT_PREFIX: "script",
  LIB_PREFIX: "lib",
  USERINFO_PREFIX: "userinfo",
  // indexes
  SCRIPTS_INDEX: "scripts",
  SCRIPTS_PART_KEY: "is_script",
  // EMAIL_NICKNAME_INDEX I believe is not used
  /* not used */ EMAIL_NICKNAME_INDEX: "user_email-nickname-index", // gets users
  EMAIL_PATH_INDEX: "user_email-path-TO-all-index", // gets seders
  /* You need a separate index that is only populated when path is present
    because this fetches seders that a logged-in user has created, but no one
    has joined yet. */
  EMAIL_GAME_NAME_INDEX: "user_email-game_name-index", // gets participants
  OPAQUE_COOKIE_INDEX: "opaque_cookie_index",
  // attribute names
  SCRIPT_VERSION: "script_version",
  // scripts
  HAGGADAH_DESCRIPTION: "haggadah_description",
  HAGGADAH_NAME: "haggadah_name",
  HAGGADAH_SHORT_DESC: "haggadah_short_desc",
  PATH: "path",
  SCRIPT_NUMBER: "script_number",
  // seders
  CREATED: "created",
  CLOSED: "closed",
  TIMESTAMP: "timestamp",
  // participants
  SESSION_KEY: "session_key",
  GAME_NAME: "game_name",
  ASSIGNMENTS: "assignments",
  ANSWERS: "answers",
  // users
  USER_NICKNAME: "user_nickname",
  USER_EMAIL: "user_email",
  // opaque cookie
  OPAQUE_COOKIE: "opaque_cookie",
  OPAQUE_COOKIE_ISSUED_MILLISECONDS: "cookie_issued_ms",
  OPAQUE_COOKIE_EXPIRATION_MILLISECONDS: "cookie_expiration_ms",
  OPAQUE_COOKIE_ISSUED_DATE: "cookie_issued_date",
  OPAQUE_COOKIE_EXPIRATION_DATE: "cookie_expiration_date",
  // WebSockets
  CONNECTION: "connection",
  EVENT: "event", // CONNECT or DISCONNECT
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  DATE: "date",
  MS: "ms",
  CONNECTION_ID: "connection_id",
  WAIT: "wait", // wait page, ws-wait WS API
  READ_ROSTER: "read-roster",
};

module.exports = schema;
