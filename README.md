## Prerequisites

You need to setup, 

* nodenv

You also need specific setup for `frontend`, `backend`, `aws cdk`.
See each README under the folders.

## Overview

this root dir has truly shared resources.
For example, `.gitignore`.

## Codebase

There are 3 main folders. Each folder have independent `package.json`, npm commands, and README.
* `./frontend` frontend source code. For example, Nuxt resources, adapter from Lambda to Nuxt, frontend build/dev commands
* `./backend` backend source code. For example, BFF Express source code, adapter from Lambda to Express, backend build/dev commands
* `./aws` AWS CDK IaC source code. For example, CDK source code and IaC build/deploy commands

## Application Design

### When Dev

* frontend
  * Nuxt3 dev server starts on `http://localhost:3000`,which connects to BFF
* backend BFF
  * Node.js dev server starts on `http://localhost:3001`, which connects to local database
  * local database starts on `http://localhost:8000`, which is set up by `npm run init-db` command in backend
* backend Trigger
  * you cannot run backend Trigger locally.

### At Production

* frontend
    * API Gateway and Lambda listens on `https://books.${domainName}`,which connects to BFF
* backend BFF
    * API Gateway and Lambda listens on `https://bff.books.${domainName}`, which connects to production database
    * production DynamoDB is up. connection configurations are passed to BFF Lambda as environment variable when CDK deploy AWS resources.
* backend Trigger
    * Lambda is deployed to AWS so that DynamoDB calls it when updated

## Getting Started at Local

1. According to backend and frontend README, start up both servers.
2. Access frontend by browser, then login page will be rendered.
3. Enter 'sam@ple.com' as email (any password is okay).
