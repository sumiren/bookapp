#!/usr/bin/env node
import { BooksStack } from '../lib/books-stack'
import { CdkApp } from '../lib/cdk-app'
import { Environment } from '../lib/environment'
import { BaseHostedZoneStack } from '../lib/base-hosted-zone-stack'
import * as AWS from 'aws-sdk'

async function handle () {
  const app = new CdkApp()
  const environmentName = app.tryGetContext('env')
  const parentDomain = app.tryGetContext('parent_domain')
  console.log('env name...', environmentName)
  console.log('parent domain...', parentDomain)

  const environment = Environment.of(environmentName, parentDomain)

  const region = AWS.config.region
  const accountId = (await new AWS.STS().getCallerIdentity({})
    .promise()).Account

  const baseHostedZoneStack = new BaseHostedZoneStack(
    app,
    environment.decoratedStackName('BooksHostedZoneStack'),
    {
      environment,
      env: {
        account: accountId,
        region: region
      }
    })

  // eslint-disable-next-line no-new
  new BooksStack(
    app,
    environment.decoratedStackName('BooksAppStack'),
    baseHostedZoneStack.targetHostedZone,
    { environment })
}

handle()
  .then(r => console.log('cdk execution done'))
