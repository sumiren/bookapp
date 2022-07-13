export class Id {
  private innerId: string | null;

  private constructor() {
    this.innerId = null;
  }

  static delayed() {
    return new Id();
  }

  static of(value: string) {
    const id = new Id();
    id.assign(value);
    return id;
  }

  assign(value: string) {
    if (this.innerId != null) {
      throw new Error("this entity have already persisted");
    }
    this.innerId = value;
  }

  get val() {
    if (this.innerId == null) {
      throw new Error("this entity have not persisted yet");
    }
    return this.innerId;
  }
}
