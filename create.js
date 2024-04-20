import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v1 as uuid } from "uuid";

// Initialize DynamoDB DocumentClient
const dynamoDb = new DynamoDBDocumentClient({ client: new DynamoDBClient() });

export async function main(event, context) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.tableName,
        Item: {
            // The attributes of the item to be created
            userId: "123", // The id of the author
            noteId: uuid(), // A unique uuid
            content: data.content, // Parsed from request body
            attachment: data.attachment, // Parsed from request body
            createdAt: Date.now(), // Current Unix timestamp
        },
    };

    try {
        await dynamoDb.send(new PutItemCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
        };
    }
}

export const hello = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Go Serverless v2.0! ${(await message({ time: 1, copy: 'Your function executed successfully!' }))}`,
        }),
    };
};

const message = ({ time, ...rest }) => new Promise((resolve, reject) =>
    setTimeout(() => {
        resolve(`${rest.copy} (with a delay)`);
    }, time * 1000)
);