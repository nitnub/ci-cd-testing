#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { Awsec3ExpressDockerStack } from '../lib/awsec3_express_docker-stack';

const TEST_ACCT = process.env.TEST_ACCT;
const TEST_REGION = process.env.TEST_REGION;
const app = new cdk.App();
const envUSA = { account: TEST_ACCT, region: TEST_REGION };

new Awsec3ExpressDockerStack(app, 'Awsec3ExpressDockerStack',{env: envUSA} );
app.synth();
