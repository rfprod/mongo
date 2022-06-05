import * as fs from 'fs';
import yargs from 'yargs';

import { IArgs, parseArgs } from '../utils/args';
import { executeCommand, writeData } from '../utils/file';

/**
 * @name cwd
 * @constant
 * @summary Current working directory
 */
const cwd = __dirname;

/**
 * Configure help.
 */
yargs.option('dry-run', {
  alias: 'dr',
  type: 'boolean',
  description: 'Execute a feature without making changes',
});

const args: IArgs = parseArgs();

if (typeof args.help !== 'undefined') {
  yargs.showHelp();
  process.exit(0);
}

/**
 * Encode a raster image as a base64 string.
 * @param filePath image file path
 * @returns
 */
function encodeBase64(filePath: string) {
  const bitmap = fs.readFileSync(filePath);
  return Buffer.from(bitmap).toString('base64');
}

const base64 = encodeBase64(`${cwd}/data/input.png`);

executeCommand(args.dryRun, () => writeData(`${cwd}/data/output.json`, JSON.stringify({ base64 })));
