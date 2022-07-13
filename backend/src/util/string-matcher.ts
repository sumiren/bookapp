export abstract class StringMatcher {
  protected s: string;

  constructor(s: string) {
    this.s = s;
  }

  static startsWith(s: string) {
    return new StartsWith(s);
  }

  static same(s: string) {
    return new Same(s);
  }

  abstract matches(s: string): boolean;
}

class StartsWith extends StringMatcher {
  matches(s: string) {
    return s.startsWith(this.s);
  }
}

class Same extends StringMatcher {
  matches(s: string) {
    return this.s === s;
  }
}
