#!/usr/bin/env node

[
  "FACEBOOK_APP_SECRET",
  "GOOGLE_APP_SECRET",
  "AMAZON_APP_SECRET",
  "APPLE_APP_SECRET",
].forEach((varName) => {
  console.log(`${varName} ${process.env[varName] ? "present" : "absent"}`);
});
