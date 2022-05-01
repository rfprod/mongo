import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { finalize, forkJoin, from, map, of, switchMap } from 'rxjs';

import { createCollections } from './collections';
import { operators } from './operators';
import { createUsers } from './users';

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
 * Database name.
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
 * Don't use SSL for the local database instance.
 */
const ssl = !uri.includes('127.0.0.1');

void of(new MongoClient(uri, { ssl, keepAlive: true }))
  .pipe(
    switchMap(client => client.connect()),
    map(client => ({ client, db: client.db(dbName) })),
    switchMap(({ client, db }) =>
      from(db.command({ ping: 1 })).pipe(
        map(result => {
          operators.logResult(result, 'Connection check');
          return { client, db };
        }),
      ),
    ),
    switchMap(({ client, db }) =>
      forkJoin([createUsers(db), createCollections(db)]).pipe(finalize(() => client.close())),
    ),
  )
  .subscribe();
