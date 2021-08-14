#!/usr/bin/env node

const program = require("commander");
const script2json = require("../lib/script2json");

program
  .command("./txt2json.js")
  .version("1.0.0")
  .usage("<file>")
  .parse(process.argv);
if (process.argv.length < 3) {
  console.log("error: no <file> specified");
  process.exit(1);
}
const f = process.argv[2];
console.log(script2json.parseFile(f));
