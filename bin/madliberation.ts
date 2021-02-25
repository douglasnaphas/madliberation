#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { MadliberationWebapp } from "../lib/madliberation-webapp";
import { MadliberationUe1 } from "../lib/madliberation-ue1";
const stackname = require("@cdk-turnkey/stackname");

const app = new cdk.App();
new MadliberationUe1(app, stackname("ue1"), { env: { region: "us-east-1" } });
new MadliberationWebapp(app, stackname("webapp"));
