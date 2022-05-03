import { Db } from 'mongodb';
import { concat, from } from 'rxjs';

import { operators } from './operators';

/**
 * Creates the administrative database users.
 * @param db the administrative database reference
 * @returns execution stream
 */
export const createAdminDbUsers = (db: Db) => {
  const user$ = from(
    db.addUser('user', 'password', {
      roles: [{ role: 'readWrite', db: 'portal' }],
    }),
  ).pipe(operators.processStreamError());
  const admin$ = from(
    db.addUser('admin', 'password', {
      roles: ['userAdminAnyDatabase', 'dbAdminAnyDatabase', 'readWriteAnyDatabase'],
    }),
  ).pipe(operators.processStreamError());
  return concat(user$, admin$);
};

/**
 * Creates the application database users.
 * @param db the application database reference
 * @returns execution stream
 */
export const createAppDbUsers = (db: Db) => {
  const user$ = from(
    db.addUser('user', 'password', {
      roles: [{ role: 'readWrite', db: 'portal' }],
    }),
  ).pipe(operators.processStreamError());
  const admin$ = from(
    db.addUser('admin', 'password', {
      roles: [{ role: 'readWrite', db: 'portal' }],
    }),
  ).pipe(operators.processStreamError());
  return concat(user$, admin$);
};
