import { App } from 'aws-cdk-lib'

export class CdkApp extends App {
  tryGetContext (s: string): string {
    return this.node.tryGetContext(s)
  }
}
