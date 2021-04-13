import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'


const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
    hosts: [esHost],
    connectionClass: httpAwsEs
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)

    const res = await es.search({
        index: 'ontologies-index',
        body: {
            "query": {
                "function_score": {
                    "query": {
                        "multi_match": {
                            "query": event.pathParameters.id,

                            "fields": [
                                "conceptName^3",
                                "description^2.5",
                                "alternateNames^2",
                                "childIds^1",
                                "parentIds^1",
                                "conceptId"
                            ],
                            "fuzziness": "2"

                        }
                    }
                }
            },
            "size": 10
        }
    })
    const new_res = [];
    if ("hits" in res && "hits" in res.hits && res.hits.hits.length > 0) {
        res.hits.hits.map(rec => {
            let new_rec = {
                id: rec._id
            };
            new_rec = { ...new_rec, ...rec._source }
            new_res.push(new_rec);
        })
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(new_res)
    }
}

