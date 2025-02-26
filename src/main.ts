import { git } from './commands.ts';
import { keyCodes } from './select/keyCodes.ts';
import { selectBranch } from './select/select.ts';
import { color, write } from './select/writeHelpers.ts';

function parseArgs(flags: string[]) {
  const args = Deno.args;
  let flagFound = false;
  let value = undefined;
  for (let i = 0; i < args.length; i++) {
    if (flags.includes(args[i])) {
      flagFound = true;
      value = parseInt(args[i + 1]);
      if (!isNaN(value)) return { value, flagFound };
    }
  }
  return { value, flagFound };
}

let { value: c } = parseArgs(['-c', '--color']);
if (c === undefined || (c && (c < 0 || c > 255))) c = 15;
const { flagFound: origin } = parseArgs(['-o', '--origin', '-r', '--remote']);

if (origin) {
  write(color('git fetch...', c));
  await git.fetch();
  write(keyCodes.clearLine);
}

const recentBranchesList = await git.getRecentBranches.cmd(origin);

const branches = recentBranchesList
  .map((row) => {
    const splitBranchRow = row.split(git.getRecentBranches.seperator).slice(1);
    return {
      name: splitBranchRow[0],
      lastCommit: splitBranchRow[1],
    };
  })
  .filter((b) => !origin || b.name !== 'origin');

let selectedBranch = await selectBranch(branches, c);

if (!selectedBranch) Deno.exit(0);

if (origin && selectedBranch.startsWith('origin/'))
  selectedBranch = selectedBranch.slice(7);

await git.checkoutBranch(selectedBranch);
