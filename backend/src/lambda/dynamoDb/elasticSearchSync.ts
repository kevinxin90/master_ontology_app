import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
    hosts: [esHost],
    connectionClass: httpAwsEs
})

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    console.log('Processing events batch from DynamoDB', JSON.stringify(event))

    for (const record of event.Records) {
        console.log('Processing record', JSON.stringify(record))
        if (record.eventName !== 'INSERT') {
            continue
        }

        const newItem = record.dynamodb.NewImage


        const body = {
            conceptId: newItem.conceptId.N,
            description: newItem.description.S,
            displayName: newItem.displayName.S,
            parentIds: newItem.parentIds.S,
            childIds: newItem.childIds.S,
            alternateNames: newItem.alternateNames.S
        }

        await es.index({
            index: 'ontologies-index',
            type: '_doc',
            id: newItem.id.S,
            body
        })

    }
}
