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

  args.dryRun = <boolean>yargs.argv['dry-run'] ?? <boolean>yargs.argv['dr'];
  args.help = <boolean>yargs.argv['help'] ?? <boolean>yargs.argv['h'];
  return args;
};
