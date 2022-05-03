import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { finalize, from, map, of, switchMap } from 'rxjs';

import { collections } from './collections';
import { operators } from './operators';

/**
 * Load environment variables.
 */
dotenv.config();

/**
 * Database uri (connection string).
 */
const uri = process.env.DB_CONNECTION_STRING;

if (typeof uri === 'undefined') {
  const error = new Error(
    'Please verify the .env file in the project root has the DB_CONNECTION_STRING variable set.',
  );
  operators.processError(error);
  process.exit(1);
}

/**
 * Administrative database name.
 */
const dbName = process.env.DB_NAME;

if (typeof dbName === 'undefined') {
  const error = new Error(
    'Please verify the .env file in the project root has the DB_NAME variable set.',
  );
  operators.processError(error);
  process.exit(1);
}

/**
 * Application database name.
 */
const appDbName = process.env.APP_DB_NAME;

if (typeof appDbName === 'undefined') {
  const error = new Error(
    'Please verify the .env file in the project root has the APP_DB_NAME variable set.',
  );
  operators.processError(error);
  process.exit(1);
}

/**
 * Don't use SSL for the local database instance.
 */
const ssl = !uri.includes('127.0.0.1');

void of(new MongoClient(uri, { ssl, keepAlive: true }))
  .pipe(
    switchMap(client => client.connect()),
    map(client => ({ client, adminDb: client.db(dbName), appDb: client.db(appDbName) })),
    switchMap(({ client, adminDb, appDb }) =>
      from(adminDb.command({ ping: 1 })).pipe(
        map(result => {
          operators.logResult(result, 'Connection check');
          return { client, appDb };
        }),
      ),
    ),
    switchMap(({ client, appDb }) =>
      collections.dropCollections(appDb).pipe(finalize(() => client.close())),
    ),
  )
  .subscribe();
