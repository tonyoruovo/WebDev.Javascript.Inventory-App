const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
module.exports = {
    /**
     * A middleware that automatically connects to the database using a prescribed uri.
     */
	auto: () => {
		return asyncHandler(async (rq, rs, n) => {
			const uri = `mongodb://maintenance:${encodeURIComponent(
				"qwerty#123()"
			)}@127.0.0.1:27017/?directConnection=true&connectTimeoutMS=40000&authSource=admin&appName=inventory-server.js`;
			// m.con = await mongoose.connect(uri, { dbName: "inventory" });
			if(mongoose.connections.length === 0)
				rq.body.connection = mongoose.createConnection(uri);
			else rq.body.connection = mongoose.connections[0];
			n();
		});
	}
};
