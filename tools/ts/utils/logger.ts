import { COLORS } from './colors';

/**
 * Print error message in the terminal.
 * @param payload message payload
 * @param title message title
 */
const printSuccess = <T>(payload: T, title = 'Success') =>
  // eslint-disable-next-line no-console -- print success message
  console.log(`${COLORS.GREEN}%s${COLORS.DEFAULT}:\n%s`, title, payload);

/**
 * Print info message in the terminal.
 * @param payload message payload
 * @param title message title
 */
const printInfo = <T>(payload: T, title = 'Info') =>
  // eslint-disable-next-line no-console -- print info message
  console.log(`${COLORS.YELLOW}%s${COLORS.DEFAULT}:\n%s`, title, payload);

/**
 * Print error message in the terminal.
 * @param payload message payload
 * @param title message title
 */
const printError = <T>(payload: Error & T, title = 'Error') =>
  // eslint-disable-next-line no-console -- print error message
  console.log(`${COLORS.RED}%s${COLORS.DEFAULT}:\n%s`, title, payload.message);

export const logger = {
  printSuccess,
  printInfo,
  printError,
};
