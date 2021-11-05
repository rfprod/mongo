import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { finalize, forkJoin, from, map, of, switchMap } from 'rxjs';

import { createCollections } from './collections';
import { createUsers } from './users';

/**
 * Load environment variables.
 */
dotenv.config();

const uri = process.env.DB_CONNECTION_STRING;

if (typeof uri === 'undefined') {
  // eslint-disable-next-line no-console -- print error handling instructions in the terminal
  console.error(
    'Please verify the .env file in the project root has the DB_CONNECTION_STRING variable set.',
  );
  process.exit(1);
}

const dbName = process.env.DB_NAME;

if (typeof dbName === 'undefined') {
  // eslint-disable-next-line no-console -- print error handling instructions in the terminal
  console.error('Please verify the .env file in the project root has the DB_NAME variable set.');
  process.exit(1);
}

void of(new MongoClient(uri, { ssl: true, keepAlive: true }))
  .pipe(
    switchMap(client => client.connect()),
    map(client => ({ client, db: client.db(dbName) })),
    switchMap(({ client, db }) =>
      from(db.command({ ping: 1 })).pipe(
        map(result => {
          // eslint-disable-next-line no-console -- print connection check result
          console.log('Connection check', result);
          return { client, db };
        }),
      ),
    ),
    switchMap(({ client, db }) =>
      forkJoin([createUsers(db), createCollections(db)]).pipe(finalize(() => client.close())),
    ),
  )
  .subscribe();
