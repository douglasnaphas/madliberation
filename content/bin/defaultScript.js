#!/usr/bin/env node

const program = require("commander");
const defaultScript = require("../lib/defaultScript");

program
  .command("./defaultScript.js")
  .version("1.0.0")
  .usage("<file>")
  .parse(process.argv);
if (process.argv.length < 3) {
  console.log("error: no <file> specified");
  process.exit(1);
}
const f = process.argv[2];
console.log(defaultScript.parseFile(f));
