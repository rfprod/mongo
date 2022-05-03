import { Document, MongoServerError } from 'mongodb';
import { catchError, of, tap } from 'rxjs';

/**
 * Log a command execution result.
 * @param result mongodb document
 * @param title message title
 */
const logResult = (result: Document, title = 'Result') => {
  // eslint-disable-next-line no-console -- print result in the terminal
  console.log(title, ':', result);
};

/**
 * Process an error.
 * @param error error instance
 */
const processError = (error: Error) => {
  // eslint-disable-next-line no-console -- print the error in the terminal
  console.error('error', error.message);
};

/**
 * Process stream error.
 * @param exit exit after processing the error
 * @returns an empty observable
 */
const processStreamError = (exit = false) =>
  catchError((error: MongoServerError) => {
    // eslint-disable-next-line no-console -- print the error in the terminal
    console.error('error', error.message);
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
  logResult,
  processError,
  processStreamError,
};
