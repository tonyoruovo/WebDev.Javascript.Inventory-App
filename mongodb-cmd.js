// db.createUser({ user: "main", pwd: "qwerty#123()", roles: [{ role: "userAdminAnyDatabase", db: "admin" }, { role: "readWriteAnyDatabase", db: "admin" }] });
/**
 * The commented code below refers to the main admin of the database i.e the db owner.
 */
// db.createUser({ user: "name", pwd: "qwerty#123()", roles: [{ role: "dbowner", db: "inventory" }] });
/**
 * The commented code below refers to an admin that can create admins
 */
// db.createUser({ user: "admin_name", pwd: "qwerty#123()", roles: [{ role: "any custom role", db: "inventory" }] });
/**
 * The user that usually creates new accounts for external users.
*/
db.createUser({ user: "user", pwd: "password", roles: [{ role: "readWrite", db: "inventory" }] });
db.createUser({ user: "_$yste^^_", pwd: "password", roles: [{ role: "root", db: "admin" }, { role: "dbOwner", db: "admin" }] });
db.createUser({ user: "_$e\u00A2ur!ty_", pwd: "password", roles: [{ role: "root", db: "admin" }] });
/*
db.createRole({
    role: "admin_accounts",
    privileges: [{
        resource: {
            db: "inventory",
            collection: "accounts"
        },
        actions: [
            "find", "insert", "update", "delete", "remove"
        ]
    }],
    roles: [{
        role: "read",
        db: "inventory"
    }]
}, { w: "majority" , wtimeout: 5000 });

db.createRole({
    role: "maintenance",
    privileges: [{
        resource: {
            db: "inventory",
            collection: ""
        },
        actions: [
            "shutdown",
            "setDefaultRWConcern",
            "serverStatus",
            "renameCollectionSameDB",
            "reIndex",
            "netstat",
            "logRotate",
            "listSessions",
            "listSearchIndexes",
            "listIndexes",
            "listDatabases",
            "listCollections",
            "killop",
            "killCursors",
            "killAnySession",
            "killAnyCursor",
            "invalidateUserCache",
            "getLog",
            "getDefaultRWConcern",
            "getCmdLineOpts",
            "dropConnections",
            "dbStats",
            "dbHash",
            "closeAllDatabases"
        ]
    }],
    roles: []
}, { w: "majority" , wtimeout: 5000 });
*/
db.createUser({
    user: "_^^a!ntenan\u00A2e_", pwd: "password",
    roles: [
        { role: "dbAdmin", db: "admin" },
        { role: "dbAdmin", db: "inventory" },
    ]
});