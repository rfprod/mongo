import { Db } from 'mongodb';
import { concat, from } from 'rxjs';

export const createCollections = (db: Db) => {
  const collectionOne$ = from(db.createCollection('collectionOne', { capped: false }));
  const collectionTwo$ = from(db.createCollection('collectionTwo', { capped: false }));
  return concat(collectionOne$, collectionTwo$);
};
