export const keyCodes = {
  up: '\x1b[A',
  down: '\x1b[B',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
  clearPreviousLine: '\x1b[1A\x1b[K',
  clearLine: '\x1b[2K\r',
  clearColor: '\x1b[0m',
  enter: ['\n', '\r'],
  cursorUp: '\x1b[1A',
  cursorDown: '\x1b[1B',
};
