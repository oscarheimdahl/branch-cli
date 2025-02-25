import { keyCodes } from './keyCodes.ts';

export const color = (str: string, i: number) => {
  return `\x1b[38;5;${i}m${str}` + keyCodes.clearColor;
};

const te = new TextEncoder();

export const write = (str: string) => {
  Deno.stdout.writeSync(te.encode(str));
};
