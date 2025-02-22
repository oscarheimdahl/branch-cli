import * as inquirer from "@inquirer/prompts";
import {
  forEachRefCmd,
  checkoutCmd,
  handleGitError,
  currentBranchCmd,
} from "./commands.ts";

const decoder = new TextDecoder();

const currentBranchOutput = await currentBranchCmd.output();

if (!currentBranchOutput.success) {
  handleGitError("branch --show-current", currentBranchOutput.stderr);
}

const currentBranch = decoder.decode(currentBranchOutput.stdout).trim();

const output = await forEachRefCmd.cmd.output();

if (!output.success) {
  handleGitError("for-each-ref", output.stderr);
}

const refRows = decoder.decode(output.stdout).split("\n").slice(0, -1);

const refRowsSplit = refRows.map((row) =>
  row.split(forEachRefCmd.seperator).slice(1)
);

const selectedBranch = await inquirer.select({
  message: "Select branch:",
  choices: [...refRowsSplit].map((row) => ({
    name: `${row[0]} - ${row[1]}`,
    value: row[0],
  })),
});

if (
  typeof selectedBranch !== "string" ||
  (typeof selectedBranch === "string" && selectedBranch.length < 1)
) {
  console.log("An invalid branch was selected");
  Deno.exit(1);
}

const cmd = checkoutCmd(selectedBranch);

const output2 = await cmd.output();

if (!output2.success) {
  handleGitError("checkout", output.stderr);
}

console.log(`${currentBranch} -> ${selectedBranch}`);

Deno.exit(0);
