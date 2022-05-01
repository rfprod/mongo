import { Db } from 'mongodb';
import { concat, from } from 'rxjs';

import { operators } from './operators';

/**
 * Creates the database collections.
 * @param db the database reference
 * @returns execution stream
 */
export const createCollections = (db: Db) => {
  const collectionOne$ = from(db.createCollection('collectionOne', { capped: false })).pipe(
    operators.processStreamError(),
  );
  const collectionTwo$ = from(db.createCollection('collectionTwo', { capped: false })).pipe(
    operators.processStreamError(),
  );
  return concat(collectionOne$, collectionTwo$);
};
