# Tech Stack

This is `backend` folder, and adapt following tech stack

* Node.js and Express
* AWS Lambda(deploy target)
* AWS DynamoDB
* AWS DynamoDB Stream
* Docker

# Prerequisite

You need to set up,
* Docker

# How to start

First, `npm install` to install dependencies.

* `npm run init-db` start mock-db docker container and write table schemes and sample data
* `npm run dev` start the BFF dev server locally on http://localhost:3001. this needs local database(above command prepare it).
  * this command contains hot-reloading functionality.
  * you can also debug by specifying this command as the debug target in the IDE.
* `npm run build` build the application for production. Usually `/aws` folder calls this command

Don't forget `export AWS_PROFILE=xxx` when you run `npm run init-db` or `npm run dev` commands. <br>
Though local dev server doesn't use credentials, AWS SDK requires them so that it's loaded in Node.js,

# Overview

Source codes are deployed to 2 Lambda functions.

* BFF
  * Backend-For-Frontend server for Nuxt
  * Realized by Lambda and serverless-express
  * It also contains domain logic (So, there are no API servers)
* DynamoDB Stream Trigger
  * Lambda function which is called by DynamoDB Stream. Triggered when DynamoDB is updated
  * For example, Book status is asynchronously updated by trigger.

# Codebase Design

* `./src/configuration` BFF sourcecode folder
* `./src/trigger/*` Trigger source code folder
  * each folder has `handler.ts`, and deployed to Lambda.
* `./src/(the others)` 
  * both BFF and Trigger can use classes under these folders.
* `./env` resources for local database
  * `*scheme.json and *data.txt` used as local database scheme and sample data. not updated by the npm init-db command
  * `init-db.ts` use files above and init db, called by the npm init-db command.
  * note: when you'd like to update local database scheme and data from production environment
    * scheme: `fetch-table-schemes.ts` helper script fetch scheme from production environment and update`*scheme.json`
    * data: try DynamoDB Export to S3 and download file, rename it.
* `./dist`
  * `npm run build` builds both BFF and Trigger resources and emit assets to this folder

# Environment Variable

* ENVIRONMENT: local or prod.
* ASSET_DOMAIN_NAME_WITH_SCHEME: frontend domain name to verify CORS.
* BOOK_TABLE_NAME: DynamoDB book table name.
* SESSION_TABLE_NAME: DynamoDB session table name.
* SESSION_SECRET: secret to sign and verify session cookie.
* FIREBASE_SERVICE_ACCOUNT_KEY: firebase account key to verify firebase auth token(only for prod)
* AWS_PROFILE: AWS Profile for AWS-SDK.you can configure each AWS-specific environment variable instead (only local).
* LOCAL_NODE_PORT: dev server stands up on this port number (only for local).

# Build Detail

## BFF

As following, when build, bundler handles `serverless-express-adapter.ts` as entrypoint.
When develop, `console-adapter.ts` is entrypoint by `ts-node-dev`.
* `./src/configuration/`
  * `console-adapter.ts` development Node.js server adapter to express. `npm run dev` calls this
  * `serverless-express-adapter.ts` production Lambda adapter to express. entrypoint of `npm run build`
  * `node-app.ts` express application. adapted by both dev and prod

## Trigger

When build, bundler handles each `handler.ts` under `./src/trigger/*/` as entrypoint.
Note that `npm run dev` starts only **BFF** server locally.
So, you cannot debug trigger locally.

* `./src/trigger/*/handler.ts`
    * production DynamoDB Stream Trigger Lambda entrypoint.
