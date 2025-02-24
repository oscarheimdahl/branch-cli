import { checkoutBranch, getRecentBranches, seperator } from './commands.ts';
import { selectBranch } from './select.ts';

let accent = 0;
const accentFlags = ['-c', '--color', '-a', '--accent'];
const accentFlag = accentFlags.includes(Deno.args.at(0) ?? '');
const accentArg = parseInt(Deno.args.at(1) ?? '');
if (accentFlag && !isNaN(accentArg)) {
  accent = accentArg;
}

const recentBranchesList = await getRecentBranches();

const branches = recentBranchesList.map((row) => {
  const splitBranchRow = row.split(seperator).slice(1);
  return {
    name: splitBranchRow[0],
    lastCheckedOut: splitBranchRow[1],
  };
});

const selectedBranch = await selectBranch(branches, accent);

await checkoutBranch(selectedBranch);

Deno.exit(0);
