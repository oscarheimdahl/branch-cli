import { checkoutBranch, getRecentBranches, seperator } from './commands.ts';
import { selectBranch } from './select.ts';

function parseArgs(flags: string[]) {
  const args = Deno.args;
  for (let i = 0; i < args.length; i++) {
    if (flags.includes(args[i])) {
      const value = parseInt(args[i + 1]);
      if (!isNaN(value)) return value;
    }
  }
}

const bg = parseArgs(['-b', '--bg', 'background']);
const txt = parseArgs(['-t', '--txt', '--text']);

const recentBranchesList = await getRecentBranches();

const branches = recentBranchesList.map((row) => {
  const splitBranchRow = row.split(seperator).slice(1);
  return {
    name: splitBranchRow[0],
    lastCheckedOut: splitBranchRow[1],
  };
});

const selectedBranch = await selectBranch(branches, bg, txt);

await checkoutBranch(selectedBranch);

Deno.exit(0);
