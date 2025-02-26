const handleGitError = (stderr: Uint8Array<ArrayBuffer>) => {
  Deno.stdout.writeSync(stderr);
  Deno.exit(1);
};

const seperator = '|||';
const forEachRefCmd = (origin: boolean) =>
  new Deno.Command('git', {
    args: [
      'for-each-ref',
      '--sort=-committerdate',
      '--count=20',
      origin ? 'refs/remotes' : 'refs/heads',
      `--format=${seperator}%(refname:short)${seperator}%(committerdate:relative)`,
    ],
  });

const checkoutCmd = (branch: string) =>
  new Deno.Command('git', {
    args: ['checkout', branch],
  });

const fetchCmd = new Deno.Command('git', {
  args: ['fetch'],
});

const currentBranchCmd = new Deno.Command('git', {
  args: ['branch', '--show-current'],
});

const decoder = new TextDecoder();

const getCurrentBranch = async () => {
  const currentBranchOutput = await currentBranchCmd.output();
  if (!currentBranchOutput.success) handleGitError(currentBranchOutput.stderr);
  return decoder.decode(currentBranchOutput.stdout).trim();
};

const fetch = async () => {
  const currentBranchOutput = await fetchCmd.output();
  if (!currentBranchOutput.success) handleGitError(currentBranchOutput.stderr);
  return decoder.decode(currentBranchOutput.stdout).trim();
};

const getRecentBranches = async (origin: boolean) => {
  const output = await forEachRefCmd(origin).output();
  if (!output.success) handleGitError(output.stderr);
  return decoder.decode(output.stdout).split('\n').slice(0, -1);
};

const checkoutBranch = async (selectedBranch: string) => {
  const cmd = checkoutCmd(selectedBranch);
  const output2 = await cmd.output();
  if (!output2.success) handleGitError(output2.stderr);
};

export const git = {
  getCurrentBranch,
  fetch,
  getRecentBranches: {
    cmd: getRecentBranches,
    seperator,
  },
  checkoutBranch,
};
