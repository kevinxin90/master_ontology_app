import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const Table = process.env.ONTOLOGIES_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)

    var params = {
        TableName: Table,
        Key: {
            id: event.pathParameters.id
        }
    };
    console.log("pathParameters", event.pathParameters)

    const result = await docClient.delete(params).promise();

    return {
        statusCode: 202,
        headers: {
            'Access-Control-Allow-Origin': "*"
        },
        body: JSON.stringify({
            items: result
        })
    }
}
