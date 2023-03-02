import { RxJsonSchema } from "rxdb";

import { Dictionary, Entry } from "../../models/database/database.types";

export const databaseName: string = 'expressis-verbis-database';

export const meaningSchema = {
    type: 'object',
    properties: {
        definition: {
            type: 'string',
            minLength: 1,
            maxLength: 1000
        },
        examples: {
            type: 'array',
            items: {
                type: 'string',
                minLength: 1,
                maxLength: 1000
            },
            maxItems: 30
        }
    },
    required: ['definition', 'examples']
};


export const entrySchema: RxJsonSchema<Entry> = {
    title: 'entry',
    description: 'dictionary entry',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
            minLength: 36,
            maxLength: 36
        },
        words: {
            type: 'array',
            items: {
                type: 'string',
                minLength: 1,
                maxLength: 50
            },
            minItems: 1,
            maxItems: 15
        },
        meanings: {
            type: 'array',
            items: {
                ...meaningSchema
            },
            maxItems: 15
        },
        lastUpdated: {
            type: 'string',
            format: 'date-time',
            minLength: 24,
            maxLength: 24
        },
        dictionaryId: {
            ref: 'dictionary',
            type: 'string',
            minLength: 36,
            maxLength: 36
        }
    },
    required: ['id', 'words', 'meanings', 'lastUpdated', 'meanings', 'dictionaryId'],
    indexes: [
        ['dictionaryId', 'lastUpdated'],
        ['dictionaryId', 'id']
    ],
};

export const dictionarySchema: RxJsonSchema<Dictionary> = {
    title: 'dictionary',
    description: '',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    keyCompression: false,
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
            minLength: 36,
            maxLength: 36
        },
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
        },
    },
    required: ['id', 'name'],
    indexes: ['name']
};