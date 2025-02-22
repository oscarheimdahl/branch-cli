export const seperator = "|||";
export const forEachRefCmd = new Deno.Command("git", {
  args: [
    "for-each-ref",
    "--sort=-committerdate",
    "--count=10",
    "refs/heads",
    `--format=${seperator}%(refname:short)${seperator}%(committerdate:relative)`,
  ],
});

export const checkoutCmd = (branch: string) =>
  new Deno.Command("git", {
    args: ["checkout", branch],
  });

export const currentBranchCmd = new Deno.Command("git", {
  args: ["branch", "--show-current"],
});

export const handleGitError = (
  cmdName: string,
  stderr: Uint8Array<ArrayBuffer>
) => {
  console.log(`An error occurred running 'git ${cmdName}':\n`);
  console.log(new TextDecoder().decode(stderr));
  console.log("Exiting...");
  Deno.exit(1);
};

// running

const decoder = new TextDecoder();

export const getCurrentBranch = async () => {
  const currentBranchOutput = await currentBranchCmd.output();
  if (!currentBranchOutput.success)
    handleGitError("branch --show-current", currentBranchOutput.stderr);
  return decoder.decode(currentBranchOutput.stdout).trim();
};

export const getRecentBranches = async () => {
  const output = await forEachRefCmd.output();
  if (!output.success) handleGitError("for-each-ref", output.stderr);
  return decoder.decode(output.stdout).split("\n").slice(0, -1);
};

export const checkoutBranch = async (selectedBranch: string) => {
  const cmd = checkoutCmd(selectedBranch);
  const output2 = await cmd.output();
  if (!output2.success) handleGitError("checkout", output2.stderr);
};
