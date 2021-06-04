const fs = jest.requireActual('fs');

module.exports = {
  ...fs,
  // eslint-disable-next-line @typescript-eslint/ban-types
  writeFile: jest.fn((source: unknown, opts: unknown, cb: Function) => cb(null)),
};
