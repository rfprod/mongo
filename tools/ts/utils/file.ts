import { writeFile } from 'fs/promises';

import { COLORS } from './colors';

export const dryRun = (dry: boolean | undefined, callback: () => void) => {
  if (dry === true) {
    // eslint-disable-next-line no-console -- needed here to print instructions in the terminal
    console.log(
      `\n${COLORS.YELLOW}%s${COLORS.DEFAULT}\n`,
      '<< Dry run. Files were not modified. >>',
    );
    process.exit(0);
  } else {
    callback();
  }
};

export const writeData = (targetPath: string, fileContent: string) => {
  return writeFile(targetPath, fileContent)
    .then(() => {
      // eslint-disable-next-line no-console -- needed here to print output in the terminal
      console.log(`Output generated at ${targetPath}`);
    })
    .catch(error => {
      // eslint-disable-next-line no-console -- needed here to print error in the terminal
      console.log(error);
      process.exit(1);
    });
};
