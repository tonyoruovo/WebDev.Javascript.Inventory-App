const { default: mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");
const { mop } = require("../../repo/mop.cjs");
const { v } = require("../../repo/utility.cjs");
// const { v } = require("../../repo/utility.cjs");
/**
 * Constructs a middleware that initialises the database by connecting this user if they are not connected.
 * @type {() => import("../middlewares/d.cjs").Middleware<unknown, {connection: import("mongoose").Connection}, unknown, unknown>}
 */
const init = function () {
	return asyncHandler(
		async function (rq, rs, n) {
			const uri = `mongodb://127.0.0.1:27017`;
			if(!v(rq.body.c)) throw Error("No connection params");
			const o = mop({...rq.body.c});
			if(mongoose.connections.length === 0 || mongoose.connections[0].readyState !== mongoose.ConnectionStates.connected) {
				rq.body.connection = await mongoose.createConnection().openUri(uri, o);
				mongoose.connections[0] =rq.body.connection;
			} else {
				rq.body.connection = await mongoose.connections[0].openUri(uri, o);
			}
			return n();
		}
	);
};

module.exports = init;
