import * as fs from 'fs';
import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB({region: 'localhost', endpoint: `http://localhost:8000`});
run();

async function run() {

  const bookTablePromise = createTable('book-table-scheme.json')
  const sessionTablePromise = createTable('session-table-scheme.json')
  await Promise.all([bookTablePromise, sessionTablePromise])

  await batchWriteItem('book-table-data.txt', 'book')
  console.log('data imported')
}

async function batchWriteItem(fileName: string, localTableName: string){
    const bookTableData = await getBookTableData(fileName);
    const requestsGroups = sliceByNumber(bookTableData.map((item: any) => {
      return {"PutRequest": item}
    }), 25)

    for (let requestCount = 0; requestCount < requestsGroups.length; requestCount++) {
      const requestItems = {};
      requestItems[localTableName] = requestsGroups[requestCount]
      const params = {
        "RequestItems": requestItems
      };
      const res = await dynamodb.batchWriteItem(params).promise();
      console.log(res)
    }
}

async function createTable(inputFileName: string){
  let param = await fs.promises.readFile(__dirname + '/' + inputFileName, 'utf-8')
  const res = await dynamodb.createTable(JSON.parse(param)).promise();
}

async function getBookTableData(fileName: string): Promise<any>{
  let rawBookTableData = await fs.promises.readFile(__dirname + '/' + fileName, 'utf-8')
  rawBookTableData = rawBookTableData.replace(/\r?\n/g, '\r\n,');
  rawBookTableData = rawBookTableData.slice(0, rawBookTableData.length-1)
  rawBookTableData = "[" + rawBookTableData + "]"
  console.log(rawBookTableData)
  return JSON.parse(rawBookTableData);
}

function sliceByNumber(array: any[], number: number) {
  const length = Math.ceil(array.length / number)
  // @ts-ignore
  return new Array(length).fill().map((_, i) =>
    array.slice(i * number, (i + 1) * number)
  )
}
