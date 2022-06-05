import { MongoServerError } from 'mongodb';
import { catchError, of, tap } from 'rxjs';

import { logger } from '../utils/logger';

/**
 * Process stream error.
 * @param exit exit after processing the error
 * @returns an empty observable
 */
const processStreamError = (exit = false) =>
  catchError((error: MongoServerError) => {
    logger.printError(error);
    return of(null).pipe(
      tap(() => {
        if (exit) {
          process.exit(1);
        }
      }),
    );
  });

/**
 * The database operator factories.
 */
export const operators = {
  processStreamError,
};
