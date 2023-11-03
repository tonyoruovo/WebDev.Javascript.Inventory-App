const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
module.exports = {
    /**
     * A middleware that automatically connects to the database using a prescribed uri.
     * @param {import("../../server.cjs").DbObject} m
     */
	auto: m => {
		return asyncHandler(async (rq, rs, n) => {
			const uri = `mongodb://maintenance:${encodeURIComponent(
				"qwerty#123()"
			)}@127.0.0.1:27017`;
			m.con = await mongoose.connect(uri, { dbName: "inventory" });
			n();
		});
	}
};
