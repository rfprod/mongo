import { Db } from 'mongodb';
import { concat, from } from 'rxjs';

export const createUsers = (db: Db) => {
  const user$ = from(
    db.admin().addUser('user', 'password', {
      roles: [{ role: 'readWrite', db: 'portal' }],
    }),
  );
  const admin$ = from(
    db.admin().addUser('admin', 'password', {
      roles: [{ role: 'userAdminAnyDatabase', db: 'admin' }],
    }),
  );
  return concat(user$, admin$);
};
