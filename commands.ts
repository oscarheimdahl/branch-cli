const seperator = '|||';
export const forEachRefCmd = {
  seperator,
  cmd: new Deno.Command('git', {
    args: [
      'for-each-ref',
      '--sort=-committerdate',
      '--count=10',
      'refs/heads',
      `--format=${seperator}%(refname:short)${seperator}%(committerdate:relative)`,
    ],
  }),
};

export const checkoutCmd = (branch: string) =>
  new Deno.Command('git', {
    args: ['checkout', branch],
  });

export const currentBranchCmd = new Deno.Command('git', {
  args: ['branch', '--show-current'],
});

export const handleGitError = (
  cmdName: string,
  stderr: Uint8Array<ArrayBuffer>
) => {
  console.log(`An error occurred running 'git ${cmdName}':\n`);
  console.log(new TextDecoder().decode(stderr));
  console.log('Exiting...');
  Deno.exit(1);
};
