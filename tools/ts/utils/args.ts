import yargs from 'yargs';

export interface IArgs {
  dryRun?: boolean;
  help?: boolean;
}

export const parseArgs = () => {
  const args: IArgs = {
    dryRun: false,
    help: false,
  };

  const parsed = yargs()
    .option('dry-run', { alias: 'dr', type: 'boolean' })
    .option('help', { alias: 'h', type: 'boolean' })
    .parseSync();

  args.dryRun = parsed.dryRun;
  args.help = parsed.help;
  return args;
};
