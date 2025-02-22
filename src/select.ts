import { Ask } from '@sallai/ask';
import select from '@inquirer/select';
import color, { blue, gray, white } from '@sallai/iro';

const ask = new Ask({ prefix: '' });

type BranchTimeStamp = {
  name: string;
  lastCheckedOut: string;
};

export const selectBranch = async (branches: BranchTimeStamp[]) => {
  const longestNameLength = Math.max(longestBranchName(branches), 8);

  const prefix = ' → ';
  const activePrefix = color(prefix, blue);
  const inactivePrefix = ' '.repeat(prefix.length);

  const branchTitle = color('Branch', white);
  const titleSpacing = ' '.repeat(longestNameLength - 'Branch'.length + 1);
  const lastVisitedTitle = color('Last visited', white);
  const title = `${inactivePrefix}${branchTitle}${titleSpacing}${lastVisitedTitle}`;

  const rowMap = new Map<string, string>();
  const buildRow = (name: string, lastCheckedOut: string) => {
    const spacing = ' '.repeat(longestNameLength - name.length + 1);
    rowMap.set(name, spacing + lastCheckedOut);
    return name;
  };

  const choices = branches.map((branch) => ({
    message: buildRow(branch.name, branch.lastCheckedOut),
    value: branch.name,
  }));

  try {
    const res = await ask.select({
      name: 'selection',
      message: title,
      choices: choices,
      activeFormatter: (branchName: string) => {
        return (
          activePrefix +
          color(branchName, white) +
          color(rowMap.get(branchName)!, gray)
        );
      },
      inactiveFormatter: (branchName: string) => {
        return (
          inactivePrefix +
          color(branchName, gray) +
          color(rowMap.get(branchName)!, gray)
        );
      },
    } as const);

    clearPreviousLine();
    return res.selection;
  } catch {
    Deno.exit(0);
  }
};

const clearPreviousLine = () =>
  Deno.stdout.writeSync(new TextEncoder().encode('\x1b[1A\x1b[K'));

const longestBranchName = (branches: BranchTimeStamp[]) => {
  return branches.reduce((prev, curr) =>
    prev.name.length > curr.name.length ? prev : curr
  ).name.length;
};
