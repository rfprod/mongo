import { AddUserOptions, MongoClient } from 'mongodb';
import { combineLatest, first, from, switchMap } from 'rxjs';

const connectionUrl = '';

const mongoClient = new MongoClient(connectionUrl);

const connect = from(mongoClient.connect());

interface IAccountInterface {
  name: string;
  pwd: string;
  options: AddUserOptions;
}

const userAccount: IAccountInterface = {
  name: 'user',
  pwd: 'password',
  options: {
    roles: [{ role: 'readWrite', db: 'portal' }],
  },
};

const adminAccount: IAccountInterface = {
  name: 'admin',
  pwd: 'password',
  options: {
    roles: [{ role: 'userAdminAnyDatabase', db: 'admin' }],
  },
};

void connect
  .pipe(
    first(),
    switchMap(client => {
      const db = client.db('admin');
      return combineLatest([
        from(db.addUser(userAccount.name, userAccount.pwd, { ...userAccount.options })),
        from(db.addUser(adminAccount.name, adminAccount.pwd, { ...adminAccount.options })),
      ]);
    }),
  )
  .subscribe();
