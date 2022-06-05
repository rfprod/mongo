import { writeFile } from 'fs/promises';

import { logger } from './logger';

export const executeCommand = (dryRun: boolean | undefined, callback: () => void) => {
  if (dryRun === true) {
    logger.printInfo({ dryRun }, 'Dry run: files will not be modified');
    process.exit(0);
  } else {
    callback();
  }
};

export const writeData = async (targetPath: string, fileContent: string) => {
  try {
    await writeFile(targetPath, fileContent);
    logger.printSuccess(`Output generated at ${targetPath}`);
  } catch (error) {
    logger.printError(<NodeJS.ErrnoException>error);
    process.exit(1);
  }
};
