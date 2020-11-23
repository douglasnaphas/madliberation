#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { MadliberationStack } from '../lib/madliberation-stack';

const app = new cdk.App();
new MadliberationStack(app, 'MadliberationStack');
