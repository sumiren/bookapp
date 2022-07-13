import * as cdk from '@aws-cdk/core'
import { Duration } from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as ssm from '@aws-cdk/aws-ssm'
import { BooksStackProps } from './books-stack-props'
import * as route53 from '@aws-cdk/aws-route53'
import * as certificateManager from '@aws-cdk/aws-certificatemanager'

export class BooksStack extends cdk.Stack {
  private readonly targetHostedZone: route53.IHostedZone;
  private readonly bffDomainName: string;
  private readonly assetDomainName: string;
  private readonly bffDomainNameWithScheme: string;
  private readonly assetDomainNameWithScheme: string;

  constructor (scope: cdk.App, id: string, targetHostedZone: route53.IHostedZone, private props: BooksStackProps) {
    super(scope, id, props)
    this.targetHostedZone = targetHostedZone
    this.bffDomainName = `bff.books.${this.targetHostedZone.zoneName}`
    this.assetDomainName = `books.${this.targetHostedZone.zoneName}`
    this.bffDomainNameWithScheme = 'https://' + this.bffDomainName
    this.assetDomainNameWithScheme = 'https://' + this.assetDomainName
    this.bffAndTrigger()
    this.asset()
  }

  asset () {
    const booksAssetHandler = new lambda.Function(this, 'BooksAssetHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('../frontend/dist'),
      handler: 'index.handler',
      memorySize: 1024,
      environment: {
        NODE_OPTIONS: '--experimental-specifier-resolution=node',
        NUXT_PUBLIC_ENVIRONMENT: this.props.environment.environmentName,
        NUXT_PUBLIC_BFF_DOMAIN_NAME_WITH_SCHEME: this.bffDomainNameWithScheme,
        NUXT_PUBLIC_FIREBASE_API_KEY: ssm.StringParameter.fromStringParameterAttributes(this, 'AssetHandlerParam1', {
          parameterName: '/booksapp/frontend/NUXT_PUBLIC_FIREBASE_API_KEY'
        }).stringValue,
        NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ssm.StringParameter.fromStringParameterAttributes(this, 'AssetHandlerParam2', {
          parameterName: '/booksapp/frontend/NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
        }).stringValue,
        NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID: ssm.StringParameter.fromStringParameterAttributes(this, 'AssetHandlerParam3', {
          parameterName: '/booksapp/frontend/NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
        }).stringValue,
        NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ssm.StringParameter.fromStringParameterAttributes(this, 'AssetHandlerParam4', {
          parameterName: '/booksapp/frontend/NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
        }).stringValue,
        NUXT_PUBLIC_FIREBASE_PROJECT_ID: ssm.StringParameter.fromStringParameterAttributes(this, 'AssetHandlerParam5', {
          parameterName: '/booksapp/frontend/NUXT_PUBLIC_FIREBASE_PROJECT_ID'
        }).stringValue,
        NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ssm.StringParameter.fromStringParameterAttributes(this, 'AssetHandlerParam6', {
          parameterName: '/booksapp/frontend/NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
        }).stringValue
      },
      timeout: Duration.seconds(10)
    })

    // eslint-disable-next-line no-unused-vars
    const booksAssetEndpoint = new apigw.LambdaRestApi(this, 'BooksAssetEndpoint', {
      handler: booksAssetHandler
    })

    const booksAssetCertificate = new certificateManager.DnsValidatedCertificate(this, 'BooksAssetCertificate', {
      domainName: this.assetDomainName,
      hostedZone: this.targetHostedZone,
      validationMethod: certificateManager.ValidationMethod.DNS,
      region: 'us-east-1'
    })

    const booksAssetDomain = new apigw.DomainName(this, 'BooksAssetDomain', {
      domainName: this.assetDomainName,
      certificate: booksAssetCertificate,
      securityPolicy: apigw.SecurityPolicy.TLS_1_2,
      endpointType: apigw.EndpointType.EDGE
    })

    // eslint-disable-next-line no-new
    new route53.CnameRecord(this, 'BooksAssetDnsRecord', {
      zone: this.targetHostedZone,
      recordName: this.assetDomainName,
      domainName: booksAssetDomain.domainNameAliasDomainName,
      // @ts-ignore
      ttl: Duration.seconds(60)
    })

    booksAssetDomain.addBasePathMapping(booksAssetEndpoint)
  }

  bffAndTrigger () {
    const bookTable = new dynamodb.Table(this, 'BookTable', {
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING
      },
      stream: dynamodb.StreamViewType.NEW_IMAGE
    })
    const bookTableReadCapacity = bookTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 3
    })
    bookTableReadCapacity.scaleOnUtilization({
      targetUtilizationPercent: 80
    })
    const bookTableWriteCapacity = bookTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 3
    })
    bookTableWriteCapacity.scaleOnUtilization({
      targetUtilizationPercent: 80
    })

    bookTable.addLocalSecondaryIndex({
      indexName: 'taskStatus_index',
      sortKey: {
        name: 'TaskStatus',
        type: dynamodb.AttributeType.STRING
      }
    })

    bookTable.addGlobalSecondaryIndex({
      indexName: 'bookId_index',
      partitionKey: {
        name: 'BookId',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING
      }
    })
    bookTable.autoScaleGlobalSecondaryIndexReadCapacity('bookId_index', {
      minCapacity: 1,
      maxCapacity: 3
    }).scaleOnUtilization({
      targetUtilizationPercent: 80
    })
    bookTable.autoScaleGlobalSecondaryIndexWriteCapacity('bookId_index', {
      minCapacity: 1,
      maxCapacity: 3
    }).scaleOnUtilization({
      targetUtilizationPercent: 80
    })

    const sessionTable = new dynamodb.Table(this, 'SessionTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    })
    const sessionTableReadCapacity = sessionTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 3
    })
    sessionTableReadCapacity.scaleOnUtilization({
      targetUtilizationPercent: 80
    })
    const sessionTableWriteCapacity = sessionTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 3
    })
    sessionTableWriteCapacity.scaleOnUtilization({
      targetUtilizationPercent: 80
    })

    const booksBffHandler = new lambda.Function(this, 'BooksBffHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('../backend/dist/server'),
      environment: {
        ENVIRONMENT: this.props.environment.environmentName,
        BOOK_TABLE_NAME: bookTable.tableName,
        SESSION_TABLE_NAME: sessionTable.tableName,
        ASSET_DOMAIN_NAME_WITH_SCHEME: this.assetDomainNameWithScheme,
        FIREBASE_SERVICE_ACCOUNT_KEY: ssm.StringParameter.fromStringParameterAttributes(this, 'BffHandlerParam1', {
          parameterName: '/booksapp/backend/FIREBASE_SERVICE_ACCOUNT_KEY'
        }).stringValue,
        SESSION_SECRET: ssm.StringParameter.fromStringParameterAttributes(this, 'BffHandlerParam2', {
          parameterName: '/booksapp/backend/SESSION_SECRET'
        }).stringValue
      },
      handler: 'handler.handler',
      memorySize: 1024
    })

    const booksBffEndpoint = new apigw.LambdaRestApi(this, 'BooksBffEndpoint', {
      handler: booksBffHandler
    })

    const booksDbStreamTrigger = new lambda.Function(this, 'BooksDbStreamTrigger', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('../backend/dist/trigger'),
      environment: {
        BOOK_TABLE_NAME: bookTable.tableName
      },
      handler: 'bookstatus-calc/handler.handler',
      memorySize: 1024
    })

    booksDbStreamTrigger.addEventSourceMapping('BooksDbStreamMapping', {
      eventSourceArn: bookTable.tableStreamArn,
      batchSize: 10,
      startingPosition: lambda.StartingPosition.LATEST
    })

    bookTable.grantReadWriteData(booksBffHandler)
    bookTable.grantStreamRead(booksDbStreamTrigger)
    bookTable.grantReadWriteData(booksDbStreamTrigger)

    sessionTable.grantReadWriteData(booksBffHandler)

    const BooksBffCertificate = new certificateManager.DnsValidatedCertificate(this, 'BooksBffCertificate', {
      domainName: this.bffDomainName,
      hostedZone: this.targetHostedZone,
      validationMethod: certificateManager.ValidationMethod.DNS,
      region: 'us-east-1'
    })

    const booksBffDomain = new apigw.DomainName(this, 'BooksBffDomain', {
      domainName: this.bffDomainName,
      certificate: BooksBffCertificate,
      securityPolicy: apigw.SecurityPolicy.TLS_1_2,
      endpointType: apigw.EndpointType.EDGE
    })

    // eslint-disable-next-line no-new
    new route53.CnameRecord(this, 'BooksBffDnsRecord', {
      zone: this.targetHostedZone,
      recordName: this.bffDomainName,
      domainName: booksBffDomain.domainNameAliasDomainName,
      // @ts-ignore
      ttl: Duration.seconds(60)
    })

    booksBffDomain.addBasePathMapping(booksBffEndpoint)
  }
}
