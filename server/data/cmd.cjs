const {log, error} = require("console");
const err = error;
const mongoose = require("mongoose");
/* Please use mongoose transactions for saving complex/composite documents. see https://mongoosejs.com/docs/transactions.html */
/**
 * @typedef {import("mongoose")} Mongoose
 */
/**
 * @typedef {import("mongoose").Connection} Connection
 */
/**
 * @typedef {import("./d.cjs").Role} Role
 */
/**
 * @typedef {import("../data/d.cjs").AuthRestriction} AuthRestriction
 */
/**
 * @typedef {import("mongoose").WriteConcern} WriteConcern
 */
/**
 * @typedef {import("../data/d.cjs").Mechanism} Mechanism
 */
/**
 * @typedef {import("../data/d.cjs").UserPrivilege} UserPrivilege
 */
/**
 * An object with fields corresponding to the properties of a mongodb connection string.
 * @typedef {Object} ConnStr
 * @property {string} user the username
 * @property {string} pass the password
 * @property {string} host the host name e.g `127.0.0.1`
 * @property {number} [port=27017] the port number. The default is 27017
 * @property {boolean} [directConnection=true] `true` for local db, `false` for network db
 * @property {number} [connectTimeoutMS=30000] the number of milliseconds before a failed connection times out.
 * @property {string} [authSource="admin"] the authourization db for authourising users.
 * @property {string} [appName="inventory-server.js"] an optional *user-defined* name
 * @property {string} [dbName="inventory"] the name of the database to connect to
 * @property {string} [ver="1"] the api version
 */
/**
 * Connects to a mongodb database and returns an object with the connection details or throws.
 * @param {ConnStr} connStr
 * @returns {Promise<Mongoose>}
 * @throws {Error} if the connection fails (probably due to the instance of mongodb is not
 * running in the windows service or it has not being started in the `mongosh`). This may be
 * solved by manually starting the mongodb from the mongo shell (`mongosh`) using
 * ```powershell
 * mongod --dbpath C:\MongoDB\Server\6.0\data
 * ```
 * and then leave that window open as long as the connection is needed
 * or go to `Services.msc > MongoDB Server (MongoDB) > properties > start`.\
 * The mongodb instance can also be started using the .NET service API for powershell. The name of the service is `MongoDB`.
 */
const connect = async function(connStr) {
    log("called conn on " + __filename);
        // if(!mongoose.connection){
            log(connStr)
            const uri = `mongodb://${
                            encodeURIComponent(connStr.user)
                        }:${
                            encodeURIComponent(connStr.pass)
                        }@${connStr.host}:${connStr.port??27017}/?directConnection=${
                            encodeURIComponent(connStr.directConnection??true)
                        }&connectTimeoutMS=${
                            encodeURIComponent(connStr.connectTimeoutMS??30_000)
                        }&authSource=${
                            encodeURIComponent(connStr.authSource??"admin")
                        }&appName=${
                            encodeURIComponent(connStr.appName??"inventory-server.js")
                        }`;
            log(uri);
            const options = { dbName: connStr.dbName??"inventory", serverApi: { version: connStr.ver??"1" } }
            log(options);
            return await mongoose.connect(uri, options);
            // setImmediate(() => { log(`DB connected! ${mongoose.connection}`); });
            // log(`DB connected! ${mongoose.connection}`);
        // }
        // return mongoose.connection;
}
/**
 * An object for specifying the mongodb `use` directive options
 * @typedef {Object} UseDbRecord
 * @property {string} [dbName="inventory"] the db name to be used
 * @property {boolean} [useCache=true] specifies whether to use caching. See the mongodb docs for more on this option.
 */
/**
 * Creates or switches to the given database.
 * @param {UseDbRecord} db an object to be used by this function
 * @return {Connection} the connection of the db that is switched to.
 * @throws {Error} if {@linkcode connect} was never called
 */
const use = function(db) {
    try {
        let x = mongoose.connection.useDb(db.dbName, { useCache: db.useCache??true });
        setImmediate(() => {
            log(`Succesfully switched to ${db.dbName??"inventory"} db, with useCache set to ${db.useCache??true}`)
        });
        return x;
    } catch(e){
        err(e);
        throw e;
    }
}
/**
 * The simple auth object for username and password
 * @typedef {Object} Auth
 * @property {string} user the username
 * @property {string} pwd the password
 */
/**
 * @typedef {Object} AuthParam
 * @property {Auth} data
 * @property {Object} connStr
 * @property {string} connStr.uri
 * @property {Object} connStr.options
 * @property {string} connStr.options.dbName
 * @property {Object} connStr.options.serverApi
 * @property {string} connStr.options.serverApi.version
 */
/**
 * Authenticates a user
 * @param {AuthParam} param the object with the auth info
 * @return {Promise<Record<string, any>>} a object of key-value pairs
 */
const auth = async function(param) {
    console.log(param);
        return (await (await mongoose.connect(param.connStr.uri, param.connStr.options))
        .connection.useDb("admin", {
            useCache: true
        }).db.admin().command({
            authenticate: 1,
            ...param.data
        }))
}
/**
 * Create a User Record. An object with properties for creating users.
 * @typedef {Object} CUR
 * @property {1} createUser the command
 * @property {string} pwd
 * @property {string} customData
 * @property {Role[]} roles
 * @property {AuthRestriction[]} authenticationRestrictions
 * @property {WriteConcern} writeConcern
 * @property {Mechanism[]} mechanisms
 * @property {boolean} digestPassword
 * @property {*} comment
 * @property {UserPrivilege[]} privileges
 */
/**
 * Creates a user in the given `admin` database
 * @param {CUR} cur create user record. The object containing the data for creating a user
 * @return {Promise<Record<string, any>>} a object of key-value pairs
 */
const create = async function(cur){
    try {
        let r = await mongoose.connection.db.command({ ...cur });
        setImmediate(() => log("Successfully created a user"));
        return r;
    } catch (e) {
        err(e);
        throw e;
    }
};
/**
 * Shuts down a connection
 * @param {Object} p 
 * @param {1} p.shutdown 
 * @param {boolean} p.force 
 * @param {number} p.timeoutSecs 
 * @param {*} p.comment 
 * @return {Promise<Record<string, any>>} a object of key-value pairs
 */
const shutdown = async function(p){
    try {
        let x = await mongoose.connection.db.command({
            shutdown: p.shutdown,
            force: p.force,
            timeoutSecs: p.timeoutSecs,
            comment: p.comment
        });
        setImmediate(() => {
            log("Shutdown sucessful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
const logout = function(){
    try {
        mongoose.connection.close();
        setImmediate(() => {
            log("Logout successful");
        });
    } catch (e) {
        err(e);
        throw e;
    }
}

/**************** AUTH ***********************/
const drop = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            dropUser: p.dropUser,
            writeConcern: p.writeConcern,
            comment: p.comment
        });
        setImmediate(() => {
            log("Drop successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
const dropAll = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            dropAllUsersFromDatabase: p.dropAllUsersFromDatabase,
            writeConcern: p.writeConcern,
            comment: p.comment
        });
        setImmediate(() => {
            log("Dropall successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
const grantRoles = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            grantRolesToUser: p.grantRolesToUser,
            roles: p.roles,
            writeConcern: p.writeConcern,
            comment: p.comment
        });
        setImmediate(() => {
            log("Granting roles successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
const revokeRoles = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            revokeRolesFromUser: p.revokeRolesFromUser,
            roles: p.roles,
            writeConcern: p.writeConcern,
            comment: p.comment
        });
        setImmediate(() => {
            log("Revoke successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
const update = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            updateUser: p.updateUser,
            pwd: p.pwd,
            customData: p.customData,
            roles: p.roles,
            authenticationRestrictions: p.authenticationRestrictions,
            writeConcern: p.writeConcern,
            mechanisms: p.mechanisms,
            digestPassword: p.digestPassword,
            comment: p.comment,
            privileges: p.privileges
        });
        setImmediate(() => {
            log("Update successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
/**
 * Please see [usersInfo cmd](https://www.mongodb.com/docs/v7.0/reference/command/usersInfo/#mongodb-dbcommand-dbcmd.usersInfo)
 */
const userInfo = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            usersInfo: p.usersInfo,
            showCredentials: p.showCredentials,
            showCustomData: p.showCustomData,
            showPrivileges: p.showPrivileges,
            showAuthenticationRestrictions: p.showAuthenticationRestrictions,
            filter: p.filter,
            comment: p.comment,
        });
        setImmediate(() => {
            log("Info retrieval successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
/**********STATS*************/
const buildInfo = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            buildInfo: p.buildInfo
        });
        setImmediate(() => {
            log(arguments.callee.name + ". Build info retrieval successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
const dataSize = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            dataSize: p.dataSize,
            keyPattern: p.keyPattern,
            min: p.min,
            max: p.max,
            estimate: p.estimate,
        });
        setImmediate(() => {
            log(arguments.callee.name + ". Data size retrieval successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
const dbHash = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            dbHash: p.dbHash,
            collections: p.collections,
        });
        setImmediate(() => {
            log(arguments.callee.name + ". Hash retrieval successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
const dbStats = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            dbStats: p.dbStats,
            scale: p.scale,
            freeStorage: p.freeStorage,
        });
        setImmediate(() => {
            log(arguments.callee.name + ". Data stats retrieval successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
const listCommands = async function(p) {
    try {
        let x = await mongoose.connection.db.command({
            listCommands: p.listCommands,
        });
        setImmediate(() => {
            log(arguments.callee.name + ". list cmds successful");
        });
        return x;
    } catch (e) {
        err(e);
        throw e;
    }
};
/*******MISCELLANOUS*******/

/**
 * @typedef {Object} CmdParam
 * @property {Record<string, any>} cmd
 * @property {Object} connStr
 * @property {string} connStr.uri
 * @property {Object} connStr.options
 * @property {string} connStr.options.dbName
 * @property {Object} connStr.options.serverApi
 * @property {string} connStr.options.serverApi.version
 */
/**
 * Runs a low-level command. Please see the [database command list](https://www.mongodb.com/docs/v7.0/reference/command/)
 * for the parameter types.
 * @param {CmdParam} param The db command to be run
 * @return {Promise<Record<string, any>>} a promise object with the results.
 */
const run = async function(param) {
    try{
        log(param);
        return (await (await mongoose.connect(param.connStr.uri, param.connStr.options))
        .connection.useDb("admin", {
            useCache: true
        }).db.admin().command(param.cmd));
        // setImmediate(() => {
        //     log(arguments.callee.name + ". Command successful");
        // });
        // return x;
    } catch(e){
        // err(e);
        throw e;
    }
};

module.exports = {
    connect, use, create, shutdown, auth, logout, drop, dropAll, grantRoles, revokeRoles, update, userInfo, buildInfo, dataSize,
    dbHash, dbStats, listCommands, run
}
