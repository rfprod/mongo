import { Db } from 'mongodb';
import { combineLatest, concat, concatMap, from, map, of, switchMap } from 'rxjs';

import { operators } from './operators';
import { TCollectionOptions, validators } from './validators';

/**
 * Checks if the database collection exists.
 * @param db the database reference
 * @param collection the collection name
 * @returns the execution stream
 */
const collectionExists = (db: Db, collection: string) =>
  from(db.collections()).pipe(
    map(collections => collections.filter(item => item.collectionName === collection).length > 0),
  );

/**
 * Creates a database collection.
 * @param db the database reference
 * @param name the collection name
 * @param options the collection options
 * @returns the execution stream
 */
const createCollection = (db: Db, name: string, options: TCollectionOptions) =>
  from(db.createCollection(name, { ...options }));

/**
 * Drops a database collection.
 * @param db the database reference
 * @param name the collection name
 * @returns the execution stream
 */
const dropCollection = (db: Db, name: string) =>
  collectionExists(db, name).pipe(
    switchMap(exists => (exists ? from(db.dropCollection(name)) : of(null))),
  );

/**
 * Creates the collection one.
 * @param db the database reference
 * @param collection the collection name
 * @param firstIndex the first index of the collection
 * @param secondIndex the second index of the collection
 * @returns the execution stream
 */
const createCollectionOne = (
  db: Db,
  collection = 'collectionOne',
  firstIndex = 'name-index',
  secondIndex = 'date-index',
) =>
  collectionExists(db, collection).pipe(
    switchMap(exists =>
      !exists
        ? createCollection(
            db,
            collection,
            validators.collectionOptions(validators.collectionOneValidator()),
          ).pipe(
            concatMap(result =>
              combineLatest([
                from(result.createIndex({ name: 1 }, { name: firstIndex })),
                from(result.createIndex({ date: 1 }, { name: secondIndex })),
              ]),
            ),
            operators.processStreamError(),
          )
        : of(null),
    ),
  );

/**
 * Creates the collection two.
 * @param db the database reference
 * @param collection the collection name
 * @param firstIndex the first index of the collection
 * @param secondIndex the second index of the collection
 * @returns the execution stream
 */
const createCollectionTwo = (
  db: Db,
  collection = 'collectionTwo',
  firstIndex = 'name-index',
  secondIndex = 'date-index',
) =>
  collectionExists(db, collection).pipe(
    switchMap(exists =>
      !exists
        ? createCollection(
            db,
            collection,
            validators.collectionOptions(validators.collectionTwoValidator()),
          ).pipe(
            concatMap(result =>
              combineLatest([
                from(result.createIndex({ name: 1 }, { name: firstIndex })),
                from(result.createIndex({ date: 1 }, { name: secondIndex })),
              ]),
            ),
            operators.processStreamError(),
          )
        : of(null),
    ),
  );

/**
 * Creates the application database collections.
 * @param db the application database reference
 * @returns the execution stream
 */
const createCollections = (db: Db) => {
  const collectionOne$ = createCollectionOne(db);
  const collectionTwo$ = createCollectionTwo(db);
  return concat(collectionOne$, collectionTwo$);
};

/**
 * Drop the application database collections.
 * @param db the application database reference.
 * @returns the execution stream
 */
const dropCollections = (db: Db) => {
  const dropCollectionOne$ = dropCollection(db, 'collectionOne');
  const dropCollectionTwo$ = dropCollection(db, 'collectionTwo');

  return concat(dropCollectionOne$, dropCollectionTwo$);
};

/**
 * The database collection factories.
 */
export const collections = {
  createCollections,
  dropCollections,
};
