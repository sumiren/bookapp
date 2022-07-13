## Tech Stack

This is `AWS infrastructure as code` folder, and adapt following tech stack

* AWS CDK

## Prerequisites

you need to setup, 

* AWS CLI: https://cdkworkshop.com/20-typescript.html
* AWS profile in local: https://cdkworkshop.com/15-prerequisites/200-account.html
* AWS CDK Toolkit: https://cdkworkshop.com/15-prerequisites/500-toolkit.html

## How to start

First, `npm install` to install dependencies.

* `npm run build` build CDK source code
* `npm run diff` check differences between local and production environment
* `npm run deploy` deploy stacks to production environment
* `npm run synth` just emits CloudFormation template, not deploy

Don't forget `export AWS_PROFILE=xxx` and `export PARENT_DOMAIN=xxx` when you run environment related commands. Or, CDK returns error because it cannot judge which environment to connect nor  which credentials to use.

## Deploy Command Design

`frontend` and `backend` folders have build commands.
So, `npm run deploy` first ask them to build their resources, and then get their `dist` to deploy.

## Note: Tutorial  
See [this useful workshop](https://cdkworkshop.com/20-typescript.html) on working with the AWS CDK for Typescript projects.
