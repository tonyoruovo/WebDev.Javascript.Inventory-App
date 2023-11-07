const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { create } = require("../../models/account.cjs");
const { throws, nAuth } = require("./error.cjs");
const { v, rootFolder } = require("../../repo/utility.cjs");

/**
 * Middleware for JWT authentication. This provides protection of routes for users and validation of Bearer authentication headers.
 * @todo Personally I think we should implement our own `jwt.verify` and `jwt.sign` because the way it is current set up, we are
 * giving away our secret key to the client which is not advisable. We should reserve the secret key (which we would encode in 256
 * bits using the `crypto` module) to ourselves when we assign it to the user during signin and then when we are verifying it in
 * authenticate middleware, we would then use it to decrypt/verify the token. Even as I type this I see that this could be redundant,
 * But I am just not comfortable putting the secret key in the hands of the client.
 * @type {import("../middlewares/d.cjs").Middleware<unknown, {connection: import("mongoose").Connection}, unknown, unknown>}
 */
const auth = asyncHandler(
	/** */ async (
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
				const verified = jwt.verify(t, require(rootFolder() + "/config.json").jwt);
				const Account = create(req.body.connection);
				req.user = await Account.findById(verified.id).select("_id -_h");
				if (!v(req.user) || !v(req.user._u)) nAuth(Error("Not Authourized"));
				next();
			} catch (e) {
				throws(e, "", 400);
			}
		} else if(v(req.cookies)){
			const cookies = req.cookies;
			try {
				const headerPayload = cookies.hp.split(".");
				const signature = cookies.s;
				const token = weld(headerPayload[0], headerPayload[1], signature);
				const verified = jwt.verify(token, require(rootFolder() + "/config.json").jwt);
				// console.log({connection: req.body.connection});
				const Account = create(req.body.connection);
				req.user = await Account.findById(verified.id).select("_id -_h");
				if (!v(req.user) || !v(req.user._u)) nAuth(Error("Not Authourized"));
				next();
			} catch (e) {
				throws(e, "", 400);
			}
		} else nAuth(Error("Not Authourized"));
	}
);
/**
 * Parses the arguments into a valid JWT syntax token.
 * @param {string} h the header portion of the jwt
 * @param {string} p the payload portion of the jwt
 * @param {string} sig the signature portion of the jwt
 * @returns {string} the completely welded JWT
 */
function weld(h, p, sig) {
	return `${h}.${p}.${sig}`;
}

module.exports = auth;
