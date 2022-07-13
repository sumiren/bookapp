import * as fs from 'fs';
import * as AWS from 'aws-sdk';

const bookTableName = process.env.AWS_BOOK_TABLE_NAME;
const sessionTableName = process.env.AWS_SESSION_TABLE_NAME;
if (!bookTableName || !sessionTableName) {
  throw new Error('テーブル名が存在しません');
}

const dynamodb = new AWS.DynamoDB({region: process.env.AWS_REGION});
const bookSchemePromise = writeSchemeJson(bookTableName, 'book-table-scheme.json', 'book')
const sessionSchemePromise = writeSchemeJson(sessionTableName, 'session-table-scheme.json', 'session')
Promise.all([bookSchemePromise, sessionSchemePromise])
  .then(r => console.log('all scheme written to json'))


async function writeSchemeJson(tableName: string, fileName: string, localTableName: string){
  const params = { TableName: tableName };
  const result =  await dynamodb.describeTable(params).promise();
  console.log(result)

  if (result.Table === undefined){
    throw new Error('Table is not returned')
  }
  const filtered = result.Table;
  delete filtered.ProvisionedThroughput?.NumberOfDecreasesToday
  if (filtered.LocalSecondaryIndexes !== undefined) {
    const length = filtered.LocalSecondaryIndexes.length
    for (let i = 0; i < length; i++) {
      delete filtered.LocalSecondaryIndexes[i].IndexSizeBytes
      delete filtered.LocalSecondaryIndexes[i].ItemCount
      delete filtered.LocalSecondaryIndexes[i].IndexArn
    }
  }
  if (filtered.GlobalSecondaryIndexes !== undefined) {
    const length = filtered.GlobalSecondaryIndexes.length
    for (let i = 0; i < length; i++) {
      delete filtered.GlobalSecondaryIndexes[i].IndexStatus
      delete filtered.GlobalSecondaryIndexes[i].IndexSizeBytes
      delete filtered.GlobalSecondaryIndexes[i].ItemCount
      delete filtered.GlobalSecondaryIndexes[i].IndexArn
      delete filtered.GlobalSecondaryIndexes[i].ProvisionedThroughput?.NumberOfDecreasesToday
    }
  }
  delete filtered.TableStatus
  delete filtered.CreationDateTime
  delete filtered.TableSizeBytes
  delete filtered.ItemCount
  delete filtered.TableArn
  delete filtered.TableId
  delete filtered.LatestStreamLabel
  delete filtered.LatestStreamArn
  filtered.TableName = localTableName

  await fs.promises.writeFile(__dirname + "/" + fileName, JSON.stringify(filtered, null, "\t"));
}
