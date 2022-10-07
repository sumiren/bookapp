
import { Construct } from 'constructs'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { BooksStackProps } from './books-stack-props'
import { Stack } from 'aws-cdk-lib'

export class BaseHostedZoneStack extends Stack {
    private readonly _targetHostedZone: route53.IHostedZone;

    constructor (scope: Construct, id: string, props: BooksStackProps) {
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
