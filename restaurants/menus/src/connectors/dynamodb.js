import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Table, Entity } from 'dynamodb-toolbox';

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // if not false explicitly, we set it to true.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
}

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  // NOTE: this is required to be true in order to use the bigint data type.
  wrapNumbers: false, // false, by default.
}

const translateConfig = { marshallOptions, unmarshallOptions }

// Instantiate a DocumentClient
const DocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), translateConfig)

const EntitiesTable = new Table({
  name: process.env.ENTITIES_TABLE_NAME,

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Add the DocumentClient
  DocumentClient
})

export const Restaurant = new Entity({
  // Specify entity name
  name: 'Restaurant',

  // Define attributes
  attributes: {
    pk: {
      partitionKey: true,
      hidden: true,
      type: 'string',
      default: (data) => `restaurant#${data.name}`
    },
    sk: {
      sortKey: true,
      hidden: true,
      type: 'string',
      default: (data) => `metadata#${data.name}`
    },
    name: { type: 'string', required: true },
    desc: { type: 'string' },
    imgUrl: { type: 'string' }
  },

  // Assign it to our table
  table: EntitiesTable

});

export const Category = new Entity({
  // Specify entity name
  name: 'Category',

  // Define attributes
  attributes: {
    pk: {
      partitionKey: true,
      hidden: true,
      type: 'string',
      default: (data) => `restaurant#${data._restaurant}`
    },
    sk: {
      sortKey: true,
      hidden: true,
      type: 'string',
      default: (data) => `category#${data.name}`
    },
    name: { type: 'string', required: true },
    desc: { type: 'string' },
    imgUrl: { type: 'string' },
    _restaurant: { save: false }
  },

  // Assign it to our table
  table: EntitiesTable

});