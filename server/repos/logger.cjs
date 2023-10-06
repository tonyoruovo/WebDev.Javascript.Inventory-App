const { join } = require("node:path");

const { existsSync, writeFile, readFile } = require("node:fs");
/**
 * Performs backward recursion from the given `start` directory and returns the path to the first folder where a `package.json` exists.
 * @param { string } start the directory from which path traversal begins.
 * @returns {string} the path to the folder where the first `package.json` file was found
 */
function rootFolder(start = __dirname) {
  while (!existsSync(join(start, "package.json"))) {
    start = join(start, "..");
  }
  return start;
}
/**
 * Writes the given parameter(s) to an information log along with a `time` property in JSON format.
 * @param  {...any} msg a parameter list of values to be logged. Note that all values are converted to string before they are written to the info log.
 */
const log = function(...msg) {
    const path = `${rootFolder()}/server/data/log.json`;
    readFile(path, "utf-8", (e, data) => {
        if(e){
            console.log(e);
            throw e;
        }
        let logs;
        try{
            logs = JSON.parse(data);
        }
        catch(e){
            logs = {};
        }
        // const logs = JSON.parse(data);
        const d = new Date();
        let i = 0;
        const o = {
            [d.toTimeString()]: {}
        }
        for (const x of msg) {
            o[d.toTimeString()][`msg${i++}`] = x
        }
        logs[d.toDateString()] = o;
        writeFile(path, JSON.stringify(logs), {
            encoding: "utf-8",
            flag: "w+"
        }, e => {
            if(e) {
                console.error(e);
            } else console.log(d + ", data was logged")
        });
    })
}
/**
 * Writes the given parameter(s) to an error log along with a `time` property in JSON format.
 * @param  {...any} msg a parameter list of values to be logged. Note that all values are converted to string before they are written to the info log.
 */
const err = function(...msg) {
    const path = `${rootFolder()}/server/data/err.json`;
    readFile(path, "utf-8", (e, data) => {
        if(e){
            console.log(e);
            throw e;
        }
        let errs;
        try{
            errs = JSON.parse(data);
        }
        catch(e){
            errs = {};
        }
        // const errs = JSON.parse(data);
        const d = new Date();
        let i = 0;
        const o = {
            [d.toTimeString()]: {}
        }
        for (const x of msg) {
            o[d.toTimeString()][`msg${i++}`] = x
        }
        errs[d.toDateString()] = o;
        writeFile(path, JSON.stringify(errs), {
            encoding: "utf-8",
            flag: "w+"
        }, e => {
            if(e) {
                console.error(e);
            } else console.error(d + ", error was logged")
        });
    })
}
/**
 * Writes the given parameter(s) to a warning log along with a `time` property in JSON format.
 * @param  {...any} msg a parameter list of values to be logged. Note that all values are converted to string before they are written to the info log.
 */
const warn = function(...msg) {
    const path = `${rootFolder()}/server/data/warn.json`;
    readFile(path, "utf-8", (e, data) => {
        if(e){
            console.log(e);
            throw e;
        }
        let warn;
        try{
            warn = JSON.parse(data);
        }
        catch(e){
            warn = {};
        }
        // const warn = JSON.parse(data);
        const d = new Date();
        let i = 0;
        const o = {
            [d.toTimeString()]: {}
        }
        for (const x of msg) {
            o[d.toTimeString()][`msg${i++}`] = x
        }
        warn[d.toDateString()] = o;
        writeFile(path, JSON.stringify(warn), {
            encoding: "utf-8",
            flag: "w+"
        }, e => {
            if(e) {
                console.error(e);
            } else console.warn(d + ", warning was logged")
        });
    });
}

module.exports = {
    log, err, warn
}