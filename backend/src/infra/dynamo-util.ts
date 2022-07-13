export class DynamoUtil {
  static rmPrefix(idInDb: string) {
    const sharpIndex = idInDb.indexOf("#");
    return idInDb.slice(sharpIndex + 1);
  }
}
