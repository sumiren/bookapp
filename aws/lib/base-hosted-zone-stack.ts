import * as cdk from '@aws-cdk/core'
import * as route53 from '@aws-cdk/aws-route53'
import { BooksStackProps } from './books-stack-props'

export class BaseHostedZoneStack extends cdk.Stack {
    private readonly _targetHostedZone: route53.IHostedZone;

    constructor (scope: cdk.Construct, id: string, props: BooksStackProps) {
      super(scope, id, props)

      console.log('parent domain...' + props.environment.parentDomain)
      this._targetHostedZone = route53.HostedZone.fromLookup(this, 'BooksHostedZone', {
        domainName: props.environment.parentDomain
      })
    }

    get targetHostedZone (): route53.IHostedZone {
      return this._targetHostedZone
    }
}
