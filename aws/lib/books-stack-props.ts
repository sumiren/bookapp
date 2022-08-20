import { Environment } from './environment'
import { StackProps } from 'aws-cdk-lib'

export interface BooksStackProps extends StackProps{
  readonly environment: Environment;
}
