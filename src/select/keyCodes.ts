export const keyCodes = {
  up: '\x1b[A',
  down: '\x1b[B',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
  clearPreviousLine: '\x1b[1A\x1b[K',
  clearColor: '\x1b[0m',
  enter: ['\n', '\r'],
};
