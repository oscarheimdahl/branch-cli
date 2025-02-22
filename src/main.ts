import {
  checkoutBranch,
  getCurrentBranch,
  getRecentBranches,
  seperator,
} from "./commands.ts";
import { selectBranch } from "./select.ts";

const currentBranch = await getCurrentBranch();
const recentBranchesList = await getRecentBranches();

const branches = recentBranchesList.map((row) => {
  const splitBranchRow = row.split(seperator).slice(1);
  return {
    name: splitBranchRow[0],
    lastCheckedOut: splitBranchRow[1],
  };
});

const selectedBranch = await selectBranch(branches);

await checkoutBranch(selectedBranch);

console.log(`${currentBranch} -> ${selectedBranch}`);

Deno.exit(0);
