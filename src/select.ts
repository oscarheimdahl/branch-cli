// deno-lint-ignore-file ban-ts-comment
// @deno-types="npm:@types/prompts"
import prompts from 'prompts';

import {
  bgBlack,
  bgBlue,
  bgCyan,
  bgGreen,
  bgMagenta,
  bgRed,
  bgWhite,
  bgYellow,
  black,
  blue,
  cyan,
  gray,
  green,
  magenta,
  red,
  white,
  yellow,
} from 'kleur/colors';

type BranchTimeStamp = {
  name: string;
  lastCheckedOut: string;
};

const backgrounds = [
  (str: string) => str,
  bgWhite,
  bgBlack,
  bgBlue,
  bgGreen,
  bgYellow,
  bgMagenta,
  bgCyan,
  bgRed,
];

const texts = [
  (str: string) => str,
  white,
  black,
  blue,
  green,
  yellow,
  magenta,
  cyan,
  red,
];

export const selectBranch = async (
  branches: BranchTimeStamp[],
  bg: number = 3,
  txt: number = 2
) => {
  const longestNameLength = Math.max(longestBranchName(branches), 15);

  const branchTitle = ' Branch';
  const titleSpacing = ' '.repeat(longestNameLength - branchTitle.length + 3);
  const lastVisitedTitle = 'Last visited ';
  const bgColor = backgrounds[bg] ?? backgrounds[0];
  const txtColor = texts[txt] ?? texts[0];
  const title = bgColor(
    txtColor(`${branchTitle}${titleSpacing}${lastVisitedTitle}`)
  );

  const buildRow = (name: string, lastCheckedOut: string) => {
    const spacing = ' '.repeat(longestNameLength - name.length + 2);

    return white('  ' + name) + gray(spacing) + gray(lastCheckedOut);
  };

  const res = await prompts({
    type: 'select',
    name: 'branch',
    message: 'git checkout',
    instructions: false,
    hint: title,
    active: 'true',
    choices: branches.map((branch) => ({
      title: buildRow(branch.name, branch.lastCheckedOut),
      value: branch.name,
    })),
    onRender: function () {
      // @ts-ignore
      this.msg = '';
    },
  });

  clearPreviousLine();

  return res.branch;
};

const clearPreviousLine = () =>
  Deno.stdout.writeSync(new TextEncoder().encode('\x1b[1A\x1b[K'));

const longestBranchName = (branches: BranchTimeStamp[]) => {
  return branches.reduce((prev, curr) =>
    prev.name.length > curr.name.length ? prev : curr
  ).name.length;
};
