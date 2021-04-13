import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { decode, verify } from 'jsonwebtoken'
import { JWK } from 'jwk-to-pem'
import * as jwkToPem from 'jwk-to-pem'

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    try {
        const decodedToken = decode(
            event.authorizationToken
        )
        console.log("decodedToken", decodedToken);

        if (decodedToken.aud !== "5amsgt9ragatpg48lfcifdkct6") {
            throw new Error('Invalid audience: ' + decodedToken.aud);
        }

        if (decodedToken.iss !== "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_G7rlIXRO1") {
            throw new Error('Invalid issuer: ' + decodedToken.iss);
        }

        const key = {
            "alg": "RS256",
            "e": "AQAB",
            "kid": "lS5Zuc8khUvJ+IXFUTz0uV81WkQ4Wd6+ae2P2zTBtqs=",
            "kty": "RSA",
            "n": "pnDsUbegZ7VXI_ouUW_XBWTWi76BOM9OUIkmsPG4iJ5JSybeyVSPZc1THWzARfM7NV12EUO78dO9i6mtGthVKp0PzJR-RjfC3Zwnwl_HDIX9xNq3pyCQYQvW4dg_Af92NwWzyMBLOtFEMjwmwPF5GO0pBT_aHppuO2705u1fP7RMO4BuF5Z50KZVzE0tVs6UJPpAOyjv2ax_50cQbu8y_Mxl88A9B0ex7aLT4rozQs4_n1CIFaqtjAsrxo66oGefY6__dPoMTKQQSon1DqqG0gI8fQ1J78ZzPNZ1aCIqeDlRntvUAF1QOz54AjDmWSR47YFWoRStz8PI6boGi_kIkQ",
            "use": "sig"
        } as JWK;

        var pem = jwkToPem(key);
        verify(event.authorizationToken, pem)
        console.log('User was authorized', decodedToken)
        if (Array.isArray(decodedToken['cognito:groups']) && decodedToken['cognito:groups'].includes("ontology")) {
            console.log("user belongs to ontology group")
            return {
                principalId: decodedToken["cognito:username"],
                policyDocument: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Action: 'execute-api:Invoke',
                            Effect: 'Allow',
                            Resource: "*"
                        }
                    ]
                }
            }
        }
        console.log("user does not belong to ontology group")
        return {
            principalId: decodedToken["cognito:username"],
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: [
                            "arn:aws:execute-api:us-east-1:*/GET/ontology/*",
                            "arn:aws:execute-api:us-east-1:*/GET/ontologies",
                            "arn:aws:execute-api:us-east-1:*/GET/search/*"
                        ]
                    }
                ]
            }
        }
    } catch (e) {
        console.log('User was not authorized', e.message)

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

