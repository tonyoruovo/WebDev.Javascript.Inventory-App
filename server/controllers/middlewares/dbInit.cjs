const { default: mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");
const { v } = require("../../repo/utility.cjs");
/**
 * Constructs a middleware that initialises the database by connecting this user if they are not connected.
 * @param {import("../../server.cjs").DbObject} m The db session object to check if this user is connected.
 */
const init = function (m) {
	return /** @type {import("./d.cjs").Middleware} */ asyncHandler(
		async function (rq, rs, n) {
			if (!v(m.con)) {
				const uri = `mongodb://${encodeURIComponent(
					rq.body.connStr.user
				)}:${encodeURIComponent(rq.body.connStr.pass)}@127.0.0.1:27017`;
				const options = {
					dbName: rq.body.connStr.dbName ?? "inventory",
					serverApi: { version: rq.body.connStr.ver ?? "1" }
				};
				rq.body.connStr = { uri, options };
				console.log({ connStr: rq.body.connStr });
				console.log("connecting: ");
				const c = await mongoose.connect(uri, options);
				console.log("connected");
				m.con = c.connection.useDb(rq.body.connStr.dbName ?? "inventory");
			}
			rq.body.dbsession = m;
			n();
		}
	);
};

module.exports = init;
