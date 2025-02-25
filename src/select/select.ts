import { keyCodes } from './keyCodes.ts';
import {
  BranchTimeStamp,
  longestBranchName,
  longestCommitLength,
  SelectOption,
} from './utils.ts';
import { color, writer, writeStdOut } from './writeHelpers.ts';

const rowGap = ' '.repeat(2);
const boxPadding = 2;

let options: SelectOption[] = [];
let longestOption = 0;
let selectedIndex = 0;
let title = '';
let branchNameColor = 15; // 120

function render(frames: number) {
  if (frames !== 0) {
    writer.clear();
  }

  writer.write(
    '╭' +
      ('─'.repeat(boxPadding - 1) + ' ' + title + '─'.repeat(boxPadding)) +
      '╮' +
      '\n'
  );

  options.forEach((option, i) => {
    let leftLine = '│';
    if (i === 0) leftLine = '↑';
    if (i === 1) leftLine = '↓';
    const selected = selectedIndex === i;
    const optionLength =
      option.name.length + option.spacing.length + option.lastCommit.length;
    writer.write(leftLine + ' '.repeat(boxPadding));
    writer.write(color(option.name, selected ? branchNameColor : 8));
    writer.write(option.spacing);
    writer.write(color(option.lastCommit, selected ? 15 : 8));
    writer.write(
      ' '.repeat(longestOption - optionLength) + ' '.repeat(boxPadding) + '│\n'
    );
  });

  writer.write('╰' + '─'.repeat(longestOption + boxPadding * 2) + '╯' + '\n');
  writer.write(keyCodes.hideCursor);
}

export async function selectBranch(
  branches: BranchTimeStamp[],
  c?: number
): Promise<string | undefined> {
  if (c !== undefined) branchNameColor = c;
  Deno.stdin.setRaw(true, { cbreak: true });

  const longestNameLength = Math.max(longestBranchName(branches), 15);
  const longestLastCommitLength = longestCommitLength(branches);

  title = buildTitle(longestNameLength, longestLastCommitLength);
  options = buildOptions(branches, longestNameLength);

  const decoder = new TextDecoder();
  const buf = new Uint8Array(3);
  let frames = 0;
  while (true) {
    render(frames);
    frames++;
    const n = await Deno.stdin.read(buf);
    if (n === null) continue;
    const keyCode = decoder.decode(buf.subarray(0, n));
    const branchSelected = handleSelectKeys(keyCode);
    if (branchSelected) break;

    const arrowPressed = handleArrowKeys(keyCode);
    if (!arrowPressed) {
      cleanup();
      // key other than arrow and enter press, cancelling
      return undefined;
    }
  }

  return branches[selectedIndex].name;
}

const buildTitle = (
  longestNameLength: number,
  longestLastCommitLength: number
) => {
  const branchTitle = 'Branch';
  const titleSpacing =
    ' ' +
    '─'.repeat(longestNameLength - branchTitle.length + rowGap.length - 2) +
    ' ';
  const lastVisitedTitle = 'Last commit';
  const lastCommitSpacing =
    ' ' + '─'.repeat(longestLastCommitLength - lastVisitedTitle.length - 1);
  return `${branchTitle}${titleSpacing}${lastVisitedTitle}${lastCommitSpacing}`;
};

const buildOptions = (
  branches: BranchTimeStamp[],
  longestNameLength: number
) => {
  return branches.map((b) => {
    const spacing = ' '.repeat(longestNameLength - b.name.length) + rowGap;

    const option = b.name + spacing + b.lastCommit;
    longestOption = Math.max(longestOption, option.length);
    return { name: b.name, spacing, lastCommit: b.lastCommit };
  });
};

const handleArrowKeys = (keyCode: string) => {
  if (keyCode === keyCodes.up) selectedIndex--;
  else if (keyCode === keyCodes.down) selectedIndex++;
  else return false;
  if (selectedIndex < 0) selectedIndex = options.length - 1;
  if (selectedIndex > options.length - 1) selectedIndex = 0;
  return true;
};

const handleSelectKeys = (keyCode: string) => {
  if (keyCodes.enter.includes(keyCode)) {
    cleanup();
    return true;
  }
  return false;
};

const cleanup = (exit: boolean = false) => {
  writer.clear();
  writeStdOut(keyCodes.showCursor);
  Deno.stdin.setRaw(false);
  if (exit) Deno.exit();
};

Deno.addSignalListener('SIGINT', () => {
  cleanup(true);
});

Deno.addSignalListener('SIGTERM', () => {
  cleanup(true);
});

const __showColors = () => {
  for (let i = 0; i < 256; i++) {
    Deno.stdout.writeSync(new TextEncoder().encode(`\x1b[38;5;${i}m ${i} `));
    if (i % 16 === 15) console.log('\x1b[0m'); // New line every 16 colors
  }
};

// __showColors();
