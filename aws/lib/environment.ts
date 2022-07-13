export class Environment {
  private constructor (public readonly environmentName: string, public readonly parentDomain: string) {
  }

  public static of (environmentName: string, domain: string): Environment {
    if (!environmentName) {
      throw new Error('環境名を明示的に指定してください')
    }
    // @ts-ignore
    if (environmentName !== 'prod' && environmentName !== 'stg' && !environmentName.startsWith('dev')) {
      console.log(environmentName)
      throw new Error('環境名が間違っています')
    }

    return new Environment(environmentName, domain)
  }

  public decoratedStackName (baseId: String) {
    return baseId + 'Env' + this.environmentName[0].toUpperCase() + this.environmentName.slice(1)
  }

  public gitBranchName (): string {
    if (this.environmentName === 'prod') { return 'main' }
    return 'TODO'
  }
}
