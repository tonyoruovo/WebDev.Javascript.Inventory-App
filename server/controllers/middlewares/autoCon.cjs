const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const { mop } = require("../../repo/mop.cjs");
// const { throws } = require("./error.cjs");
module.exports = {
    /**
     * A middleware that automatically connects to the database using a prescribed uri.
	 * @type {() => import("../middlewares/d.cjs").Middleware<unknown, {connection: import("mongoose").Connection}, unknown, unknown>}
     */
	auto: () => {
		return asyncHandler(async (rq, rs, n) => {
			const uri = `mongodb://127.0.0.1:27017`;
			const o = mop({u: "user"});
			try {
				if(mongoose.connections.length === 0 || mongoose.connections[0].readyState !== mongoose.ConnectionStates.connected){
					rq.body.connection = await mongoose.createConnection().openUri(uri, o);
					mongoose.connections[0] =rq.body.connection;
				} else {
					rq.body.connection = await mongoose.connections[0].openUri(uri, o);
				}
				// console.log("Mongoose connected to mongodb\n" + rq.body.connection.user);
				// console.log({connection: rq.body.connection});
			} catch (e) {
				return n(e);
				// throws(e, "Connection Error. Mongoose could not establish a connection", 500);
			}
			return n();
		});
	}
};
