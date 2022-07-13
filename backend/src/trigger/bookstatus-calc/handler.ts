import { DynamoUtil } from "../../infra/dynamo-util";
import { Book } from "../../domain/writemodel/book";

import { DynamoBookStore } from "../../infra/dynamo-book-store";
import { TriggerEnvironment } from "../../util/trigger-environment";

exports.handler = async (event: any) => {
  const environment = TriggerEnvironment.fromEnvironmentVariable();
  const dynamoStore = DynamoBookStore.create(environment);
  console.log("Received event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log("DynamoDB Record: %j", record.dynamodb);
  }

  const updatedBooks = Array.from(
    new Set(
      event.Records.filter(
        (r: any) =>
          r.dynamodb.NewImage.SK.S.startsWith("TASK#") &&
          r.dynamodb.NewImage.BookId?.S
      ).map((r: any) => ({
        userId: r.dynamodb.NewImage.PK.S.replace("USER#", ""),
        bookId: DynamoUtil.rmPrefix(r.dynamodb.NewImage.BookId.S),
      }))
    )
  );

  const promises = updatedBooks.map(async (b: any) => {
    const tasksOfBook = await dynamoStore.getTasksOfBookRaw(b.bookId);
    const taskStatuses = tasksOfBook.Items.map((t: any) =>
      t.TaskStatus.replace("INACTIVE_", "").replace("ACTIVE_", "")
    );
    const newStatus = Book.calculateStatusWhenTaskUpdated(taskStatuses);
    await dynamoStore.updateBookStatus(b.userId, b.bookId, newStatus);
    // TODO: bookのupdatedAtを併せて更新する

    console.log("updated book :", b.userId, b.bookId, newStatus);
  });
  await Promise.all(promises);
};
