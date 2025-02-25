import { checkoutBranch, getRecentBranches, seperator } from './commands.ts';
import { selectBranch } from './select/select.ts';

function parseArgs(flags: string[]) {
  const args = Deno.args;
  for (let i = 0; i < args.length; i++) {
    if (flags.includes(args[i])) {
      const value = parseInt(args[i + 1]);
      if (!isNaN(value)) return value;
    }
  }
}

let c = parseArgs(['-c', '--color']);
if (c && (c < 0 || c > 255)) c = undefined;

const recentBranchesList = await getRecentBranches();

const branches = recentBranchesList.map((row) => {
  const splitBranchRow = row.split(seperator).slice(1);
  return {
    name: splitBranchRow[0],
    lastCommit: splitBranchRow[1],
  };
});

const selectedBranch = await selectBranch(branches, c);

if (!selectedBranch) Deno.exit(0);
await checkoutBranch(selectedBranch);
