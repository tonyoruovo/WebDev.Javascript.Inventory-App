const { fileURLToPath } = require("url");
const fs = require("fs");
/**
 * @module package.json
 */
/**
 * The directory which is where the `package.json` file is located within this project
 * @constant
 * @type {string}
 */
// const root = fileURLToPath(new URL(".", import.meta.url).toString());
const root = fileURLToPath(__dirname);

/**
 * The `package.json` file residing in the same directory as {@link root}
 * @constant
 */
const pj = JSON.parse(fs.readFileSync(`${root}package.json`, "utf-8"));

/**
 * @exports package.json
 */
module.exports = {root,pj};
