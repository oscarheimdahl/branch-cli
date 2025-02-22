import {
  checkoutBranch,
  getCurrentBranch,
  getRecentBranches,
  seperator,
} from "./commands.ts";
import { selectBranch } from "./select.ts";

import color, { green, italic } from "@sallai/iro";

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

if (selectedBranch === currentBranch) {
  console.log(`Already on ${color(selectedBranch, italic)}`);
} else {
  await checkoutBranch(selectedBranch);
  console.log(
    `${color(currentBranch, italic)} → ${color(selectedBranch, italic)} ${color(
      "✔",
      green
    )}`
  );
}

Deno.exit(0);
