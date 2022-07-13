import { Environment } from './environment'
import { StackProps } from '@aws-cdk/core'

export interface BooksStackProps extends StackProps{
  readonly environment: Environment;
}
