const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const { mop } = require("../../repo/mop.cjs");
const { throws } = require("./error.cjs");
module.exports = {
    /**
     * A middleware that automatically connects to the database using a prescribed uri.
     */
	auto: () => {
		return asyncHandler(async (rq, rs, n) => {
			const uri = `mongodb://127.0.0.1:27017`;
			const o = mop();
			try {
				if(mongoose.connections.length === 0){
					rq.body.connection = await mongoose.createConnection().openUri(uri, o);
				} else {
					rq.body.connection = await mongoose.connections[0].openUri(uri, o);
				}
				// console.log("Mongoose connected to mongodb\n" + rq.body.connection.user);
				console.log({connection: rq.body.connection});
			} catch (e) {
				throws(e, "Connection Error. Mongoose could not establish a connection", 500);
			}
			n();
		});
	}
};
