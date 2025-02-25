import { keyCodes } from './keyCodes.ts';

export const color = (str: string, i: number) => {
  return `\x1b[38;5;${i}m${str}` + keyCodes.clearColor;
};

const te = new TextEncoder();

export const writer = {
  writtenLines: 0,
  write: function (str: string) {
    writeStdOut(str);
    str.includes('\n') && this.writtenLines++;
  },
  clear: function () {
    Array.from({ length: this.writtenLines }).forEach(() => {
      writeStdOut(keyCodes.clearPreviousLine);
    });
    this.writtenLines = 0;
  },
};

export const writeStdOut = (str: string) => {
  Deno.stdout.write(te.encode(str));
};
