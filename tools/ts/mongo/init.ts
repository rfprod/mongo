import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { finalize, forkJoin, from, map, of, switchMap } from 'rxjs';

import { createCollections } from './collections';
import { operators } from './operators';
import { createAdminDbUsers, createAppDbUsers } from './users';

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

/**
 * Application database name.
 */
const appDbName = process.env.APP_DB_NAME;

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
    map(client => ({ client, adminDb: client.db(dbName), appDb: client.db(appDbName) })),
    switchMap(({ client, adminDb, appDb }) =>
      from(adminDb.command({ ping: 1 })).pipe(
        map(result => {
          operators.logResult(result, 'Connection check');
          return { client, adminDb, appDb };
        }),
      ),
    ),
    switchMap(({ client, adminDb, appDb }) =>
      forkJoin([
        createAdminDbUsers(adminDb),
        createAppDbUsers(appDb),
        createCollections(appDb),
      ]).pipe(finalize(() => client.close())),
    ),
  )
  .subscribe();
