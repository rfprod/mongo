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

  args.dryRun = (yargs.argv['dry-run'] as boolean) ?? (yargs.argv['dr'] as boolean);
  args.help = (yargs.argv['help'] as boolean) ?? (yargs.argv['h'] as boolean);
  return args;
};
