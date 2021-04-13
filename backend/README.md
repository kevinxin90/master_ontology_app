# Backend

The backend of the project is built based on the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Project structure

The code base for backend is mainly located within the `backend/src` folder. This folder is divided in:


```
backend
├── src
│   ├── lambda               # Lambda configuration and source code folder
│   │   ├── auth
│   │   │   ├── userPoolAuthorizer.ts      # lambda function handling API Gateway authorization
│   │   ├── dynamoDb
│   │   │   ├── elasticSearchSync.ts      # lambda function to sync elasticsearch with DynamoDB
│   │   ├── elasticSearch
│   │   │   ├── query.ts      # lambda function to perform full text search against elasticsearch engine
│   │   ├── http
│   │   │   ├── createOntology.ts      # lambda function to add a new ontology into DynamoDB
│   │   │   ├── deleteOntology.ts      # lambda function to delete an ontology from DynamoDB
│   │   │   ├── getOntologies.ts      # lambda function to scan all ontologies from DynamoDB
│   │   │   ├── getOntology.ts      # lambda function to retrieve a single ontology from DynamoDB
│   │   │   ├── updateOntology.ts      # lambda function to update an ontology entry from DynamoDB
│   │
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```
