const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { Account } = require("../../models/account.cjs");
const { throws, nAuth } = require("./error.cjs");
const { v } = require("../../repo/utility.cjs");

/**
 * Middleware for JWT authentication. This provides protection of routes for users and validation of Bearer authentication headers.
 * @todo Personally I think we should implement our own `jwt.verify` and `jwt.sign` because the way it is current set up, we are
 * giving away our secret key to the client which is not advisable. We should reserve the secret key (which we would encode in 256
 * bits using the `crypto` module) to ourselves when we assign it to the user during signin and then when we are verifying it in
 * authenticate middleware, we would then use it to decrypt/verify the token. Even as I type this I see that this could be redundant,
 * But I am just not comfortable putting the secret key in the hands of the client.
 */
const auth = asyncHandler(
	/** @type {import("../middlewares/d.cjs").Middleware} */ async (
		req,
		res,
		next
	) => {
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			try {
				let t = req.headers.authorization.split(" ")[1];
				const verified = jwt.verify(t, require("../../package.json").jwt);
				req.user = await Account.findById(verified.id).select("_u _id -_h");
				if (!v(req.user) || !v(req.user._u)) nAuth(Error("Not Authourized"));
				//   const c = await Contact.findOne({
				//     _ac: req.user._id
				//   }).exec();
				//   const s = await Subject.findOne({
				//     _c: c._id
				//   }).exec();
				//   const e = await Employee.findOne({
				//     _s: s._id
				//   }).exec();
				//   req.emp = e;
				next();
			} catch (e) {
				throws(e, "", 400);
			}
		} else nAuth(Error("Not Authourized"));
	}
);

module.exports = auth;
