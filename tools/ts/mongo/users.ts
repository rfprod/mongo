import { Db } from 'mongodb';
import { concat, from } from 'rxjs';

import { operators } from './operators';

/**
 * Creates the database users.
 * @param db the database reference
 * @returns execution stream
 */
export const createUsers = (db: Db) => {
  const user$ = from(
    db.admin().addUser('user', 'password', {
      roles: [{ role: 'readWrite', db: 'portal' }],
    }),
  ).pipe(operators.processStreamError());
  const admin$ = from(
    db.admin().addUser('admin', 'password', {
      roles: [{ role: 'userAdminAnyDatabase', db: 'admin' }],
    }),
  ).pipe(operators.processStreamError());
  return concat(user$, admin$);
};
