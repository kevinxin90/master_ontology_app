import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda'


const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
    hosts: [esHost],
    connectionClass: httpAwsEs
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log('Processing event: ', event)

    await recreate();
    console.log("succesfully recreated.")
    return undefined;
}

const recreate = async () => {
    await es.indices.delete({ "index": "ontologies-index" })
    await es.indices.create({ "index": "ontologies-index" });
    await createMapping("ontologies-index", "_doc");
}

async function createMapping(index, type) {
    const schema = {
        "conceptId": {
            "type": "text"
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