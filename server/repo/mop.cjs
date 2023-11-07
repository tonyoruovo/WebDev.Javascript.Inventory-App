const mongoose = require("mongoose");
/**
 * @typedef {Object} MopParam the parameters of the function returning the mongoose options.
 * @property {string} [a="admin"] the auth database. This is the database to check for the existence of the user and it's password. This database is provided by the mongodb.
 * @property {string} [apn="inventory-server"] the `appName` option value.
 * @property {string} [db="inventory"] the database to be used with the connection that will be constructed by the options object.
 * @property {string} [p="qwerty#123()"] the password of the auth object.
 * @property {string} [u="_$yste^^_"] the username of the auth object.
 */
/**
 * Mongoose options.
 * @param {MopParam} x the options
 * @return {mongoose.ConnectOptions}
 */
const mop = (x = {
	p: "password",
	u: "_$yste^^_",
	db: "inventory",
	a: "admin",
	apn: "inventory-server"
}) => ({
	appName: x.apn || "inventory-server",
	auth: {
		password: x.p || "password",
		username: x.u || "_$yste^^_"
	},
	authSource: x.a || "admin",
	autoCreate: true,
	connectTimeoutMS: 40_000,
	dbName: x.db || "inventory",
	directConnection: true,
	// localAddress: "127.0.0.1",
	// localhost: "127.0.0.1",
	// port: 27017,
	// host: "127.0.0.1",
	// localPort: 27017,
	maxIdleTimeMS: 180_000, // 3 minutes
	serverApi: "1"
	// servername: "127.0.0.1"
});
const resetDb = async () => {
	const c = await mongoose
		.createConnection()
		.openUri(
			`mongodb://_$yste^^_:${encodeURIComponent(
				"password"
			)}@127.0.0.1:27017`,
			mop({})
		);
	console.log(
		`connected @ ${c.id}:${c.host}:${c.port}:${c.name} @ ${mongoose.now()}`
	);
	const cols = await c.db.collections();
	cols.forEach(async col => {
		console.log(`dropping ${col.collectionName} in ${col.dbName}...`);
		try {
			await col.dropIndexes();
		} catch (e) {
			console.error(e);
		}
		try {
			await col.drop({});
		} catch (e) {
			console.error(e);
		}
	});
	return c; //.useDb(env.mongodb.db[1]);
};

module.exports = {
    mop, resetDb
}
