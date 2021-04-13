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
        try {
            if (record.eventName === 'INSERT') {
                await insertItem(record)
            }
            if (record.eventName === 'REMOVE') {
                await deleteItem(record)
            }
            if (record.eventName === 'MODIFY') {
                await updateItem(record)
            }
        } catch (e) {
            console.log(e)
        }

    }
}

const insertItem = async (record) => {
    const newItem = record.dynamodb.NewImage;
    const body = {
        conceptId: newItem.conceptId.N,
        description: newItem.description.S,
        displayName: newItem.displayName.S,
        parentIds: newItem.parentIds.S,
        childIds: newItem.childIds.S,
        alternateNames: newItem.alternateNames.S
    }
    const exist = await indexExists();
    if (!exist) {
        await es.indices.create("ontologies-index");
        await createMapping("ontologies-index", "_doc");
    }
    await es.index({
        index: 'ontologies-index',
        type: '_doc',
        id: newItem.id.S,
        body
    })
}

const deleteItem = async (record) => {
    await es.delete({
        index: 'ontologies-index',
        type: '_doc',
        id: record.dynamodb.Keys.id.S,
    });
}

const updateItem = async (record) => {
    await deleteItem(record);
    await insertItem(record);
}

const indexExists = async () => {
    return es.indices.exists({
        index: 'ontologies-index'
    })
}

async function createMapping(index, type) {
    const schema = {
        "conceptId": {
            "type": "long"
        },
        "displayName": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "description": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "alternateNames": {
            "type": "text",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "childIds": {
            "type": "text"
        },
        "parentIds": {
            "type": "text"
        }
    }
    return es.indices.putMapping({ index, type, body: { properties: schema } });
}