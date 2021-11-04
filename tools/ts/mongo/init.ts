import { MongoClient } from 'mongodb';
import { finalize, forkJoin, from, map, of, switchMap } from 'rxjs';

import { createCollections } from './collections';
import { createUsers } from './users';

const uri = ''; // TODO: read from .env

const dbName = ''; // TODO: read from .env

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
