# madliberation-scripts

Scripts for Mad Liberation.

## Overview

`buildspec.yml` has commands that use `lib/script2json.js` to turn the scripts in `scripts/` into a JSON format consumable by [MLJSAPI](https://github.com/douglasnaphas/mljsapi), and put these JSON files into S3 for [passover.lol](https://github.com/douglasnaphas/madliberationjs) to find.

`madliberation-scripts` will soon also have a public web endpoint to undertake this transformation for anyone who makes a POST, to be used by the [Docs script/add-on](https://github.com/douglasnaphas/madliberation/issues/178) for script editing.

## Running locally

[These instructions](https://github.com/douglasnaphas/mljsapi/wiki/Running-MLJSAPI) apply.
