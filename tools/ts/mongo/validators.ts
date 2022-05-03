/**
 * Basic collection one validator.
 * @note reconfigure this validator and or create more validators for collections as needed.
 * @note see all bson types in the documentation https://www.mongodb.com/docs/manual/reference/bson-types/
 */
const collectionOneValidator = () => ({
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'boolean', 'integer', 'double', 'date'],
    properties: {
      name: {
        bsonType: 'string',
        description: 'must be a string and is required',
      },
      boolean: {
        bsonType: 'bool',
        description: 'must be a boolean and is required',
      },
      integer: {
        bsonType: 'int',
        description: 'must be a 32-bit integer and is required',
      },
      double: {
        bsonType: 'double',
        description: 'must be a double and is required',
      },
      date: {
        bsonType: 'date',
        description: 'must be a date and is required',
      },
    },
  },
});

/**
 * Basic collection two validator.
 * @note reconfigure this validator and or create more validators for collections as needed.
 * @note see all bson types in the documentation https://www.mongodb.com/docs/manual/reference/bson-types/
 */
const collectionTwoValidator = () => ({
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'boolean', 'integer', 'double', 'date'],
    properties: {
      name: {
        bsonType: 'string',
        description: 'must be a string and is required',
      },
      boolean: {
        bsonType: 'bool',
        description: 'must be a boolean and is required',
      },
      integer: {
        bsonType: 'int',
        description: 'must be a 32-bit integer and is required',
      },
      double: {
        bsonType: 'double',
        description: 'must be a double and is required',
      },
      date: {
        bsonType: 'date',
        description: 'must be a date and is required',
      },
    },
  },
});

type TCollectionValidator =
  | ReturnType<typeof collectionOneValidator>
  | ReturnType<typeof collectionTwoValidator>;

/**
 * Create collection options constructor.
 * @param validator the collection validator schema
 * @returns the collection validator options
 */
const collectionOptions = (validator: TCollectionValidator) => ({
  capped: false,
  validator,
});

export type TCollectionOptions = ReturnType<typeof collectionOptions>;

/**
 * The database collection validator factories.
 */
export const validators = {
  collectionOneValidator,
  collectionTwoValidator,
  collectionOptions,
};
