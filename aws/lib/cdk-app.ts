import * as cdk from '@aws-cdk/core'

export class CdkApp extends cdk.App {
  tryGetContext (s: string): string {
    return this.node.tryGetContext(s)
  }
}
