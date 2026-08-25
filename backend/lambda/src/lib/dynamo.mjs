import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const region = process.env.SES_REGION || process.env.AWS_REGION || "ap-south-1";
const TABLE = process.env.TABLE_NAME || "kattadam-main";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

export function tableName() {
  return TABLE;
}

export async function putItem(item) {
  await doc.send(new PutCommand({ TableName: TABLE, Item: item }));
}

export async function getItem(pk, sk) {
  const r = await doc.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } }));
  return r.Item ?? null;
}

export async function deleteItem(pk, sk) {
  await doc.send(new DeleteCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } }));
}

export async function queryPk(pk) {
  const r = await doc.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": pk },
    })
  );
  return r.Items ?? [];
}

export async function queryGsi1(gsi1pk) {
  const r = await doc.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :g",
      ExpressionAttributeValues: { ":g": gsi1pk },
    })
  );
  return r.Items ?? [];
}

export async function updateItem(pk, sk, patch) {
  const keys = Object.keys(patch);
  if (!keys.length) return;
  const names = {};
  const values = {};
  const parts = [];
  for (const k of keys) {
    names[`#${k}`] = k;
    values[`:${k}`] = patch[k];
    parts.push(`#${k} = :${k}`);
  }
  await doc.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { PK: pk, SK: sk },
      UpdateExpression: `SET ${parts.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
}

export function entityPk(type) {
  return `ENTITY#${type}`;
}

export function itemSk(prefix, id) {
  return `${prefix}#${id}`;
}
