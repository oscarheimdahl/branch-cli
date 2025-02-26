import { selectBranch } from '../select/select.ts';

Deno.test({
  name: 'Long lastCommit',
  fn: async () => {
    await selectBranch(
      [{ name: 'test-branch', lastCommit: '83 minutes ago' }],
      15
    );
  },
});

Deno.test({
  name: 'Short lastCommit',
  fn: async () => {
    await selectBranch([{ name: 'test-branch', lastCommit: '2 sec' }], 15);
  },
});
