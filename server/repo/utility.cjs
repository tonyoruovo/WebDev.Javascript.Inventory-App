const { existsSync } = require("fs");
const { join } = require("path");

/**
 * Checks if the given value is `undefined` or `null` and returns `false` if it is, otherwise returns `true`.
 * @param {*} x the value to be checked
 * @returns {boolean} whether or not x is a valid value
 */
const v = function (x) {
  return x !== undefined && x !== null;
};
/**
 * Checks if {@link v `v()`} returns `true` for the first argument and is a `typeof` the second argument
 * @param {*} x the value to be checked
 * @param {string} y the type that `x` is expected to be.
 * @defaultValue `"string"`
 * @default "string"
 * @returns {boolean} whether or not `x` is a valid value and the same type as `y`
 */
const vt = function(x, y = "string") {
  return v(x) && typeof x === y;
}
/**
 * Checks if the first argument is a `typeof` the second argument and returns the third argument if it isn't otherwise returns the first.
 * @param {*} x the value to be checked
 * @param {string} y the type that `x` is expected to be.
 * @defaultValue `"string"`
 * @default "string"
 * @param {*} def the default value to be sent if `vt(x, y)` returns `false`
 * @returns {*} the first argument if `vt(x,y)` returns `true` or else returns the last argument.
 */
const vd = function(x, y = "string", def = "") {
  return vt(x, y) ? x : def;
}
/**
 * Hashes the given string into a number array
 * @param {string} x the value to be hashed
 * @returns {number[]}
 */
const hsh = (x) => {
  let a = [x.length];
  for (let i = 0; i < a.length; i++) a.push(x[i].codePointAt(0));
  return a;
};
/**
 * Hashes the given string into a `bigint`
 * @param {string} x the value to be hashed
 * @returns {bigint}
 */
const hsh2 = (x) => {
  let b = 0n;
  for (let i = 0; i < x.length; i++) {
    b <<= 8n;
    b |= BigInt(x[i].codePointAt(0));
  }
  b |= BigInt(x.length) << BigInt(x.length * 8);
  return b;
};
/**
 * Performs backward recursion from the given `start` directory and returns the path to the first folder where a `package.json` exists.
 * @param { string } start the directory from which path traversal begins.
 * @returns { string } the path to the folder where the first `package.json` file was found
 */
const rootFolder = function(start = __dirname) {
  while (!existsSync(join(start, "package.json"))) {
    start = join(start, "..");
  }
  return start;
}
/**
 * @summary Simple compresser
 * @description Compresses a `bigint` into another `bigint` using bit folding
 * @param {bigint} x the value to be compressed
 * @param {number} [n=8] n the number of bits per unique fold. The default is `8`.
 * This a step property for this algorithm.
 * @returns {bigint} the resultant encoded data
 */
const fold = (x, n = 8) => {
  let tmp = 0n;
  let i = 0;
  /**@type {bigint[]} */
  let a = [];
  while (x > 0n) {
    tmp <<= 1n;
    tmp |= x & 1;
    if (i === n) a.push(tmp);
  }
  return x;
};
/**
 * The unicode code point for the [file separator character](https://en.wikipedia.org/wiki/File_separator)
 * @type {28}
 * @constant {number}
 */
const FS = 0x1c;
/**
 * The unicode code point for the [group separator character](https://en.wikipedia.org/wiki/Group_separator)
 * @type {29}
 * @constant {number}
 */
const GS = 0x1d;
/**
 * The unicode code point for the [record separator character](https://en.wikipedia.org/wiki/Record_separator)
 * @type {30}
 * @constant {number}
 */
const RS = 0x1e;
/**
 * The unicode code point for the [unit separator character](https://en.wikipedia.org/wiki/Unit_separator)
 * @type {0x1f}
 * @constant {number}
 */
const US = 0x1f;
module.exports = {
  v,
  vt,
  vd,
  rootFolder,
  hsh,
  hsh2,
  FS,
  GS,
  RS,
  US,
};
