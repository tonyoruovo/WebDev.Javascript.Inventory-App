const { readFileSync } = require("fs");

const { Types } = require("mongoose"),
	asyncHandler = require("express-async-handler"),
	{
		ini,
		strt,
		abrt,
		cmt,
		end,
		set,
		mod,
		del,
		gt
	} = require("../data/employee.cjs"),
	{ throws } = require("./middlewares/error.cjs"),
	/**
	 * Initialises a session, which can be used to start a transaction
	 * @method POST
	 * @access protected admins only
	 * @route /api/v1/employee/init
	 * @type {import("./middlewares/d.cjs").Middleware<undefined, {dbsession: import("../server.cjs").DbSession}, Record<string, *>, undefined>}
	 */
	init = asyncHandler(async function (rq, rs) {
		try {
			await ini(rq.body.dbsession);
			// delete rq.body.dbsession;
			return rs.status(200).send("Session started");
			// json({msg: "Session started",ctr: rq.body.connStr});
		} catch (e) {
			throws(e, "Conflict. Session initialisation failed", 409);
		}
	}),
	/**
	 * Starts a transaction on an active session.
	 * @method POST
	 * @access protected admins only
	 * @route /api/v1/employee/start
	 * @type {import("./middlewares/d.cjs").Middleware<undefined, {dbsession: import("../server.cjs").DbSession}, Record<string, *>, undefined>}
	 */
	start = function (rq, rs) {
		try {
			strt(rq.body.dbsession);
			// delete rq.body.dbsession;
			return rs.status(200).send("Transaction started");
			// json({msg: "Transaction started",ctr: rq.body.connStr});
		} catch (e) {
			throws(e, "Not found. Unable to start transaction", 404);
		}
	},
	/**
	 * Commits all changes on an active transaction.
	 * @method POST
	 * @access protected admins only
	 * @route /api/v1/employee/commit
	 * @type {import("./middlewares/d.cjs").Middleware<undefined, {dbsession: import("../server.cjs").DbSession}, Record<string, *>, undefined>}
	 */
	commit = asyncHandler(async function (rq, rs) {
		try {
			await cmt(rq.body.dbsession);
			// delete rq.body.dbsession;
			return rs.status(200).send("Transaction changes committed");
		} catch (e) {
			throws(e, "Not found. Unable to start transaction", 404);
		}
	}),
	/**
	 * Aborts an active transaction.
	 * @method POST
	 * @access protected admins only
	 * @route /api/v1/employee/abort
	 * @type {import("./middlewares/d.cjs").Middleware<undefined, {dbsession: import("../server.cjs").DbSession}, Record<string, *>, undefined>}
	 */
	abort = asyncHandler(async function (rq, rs) {
		try {
			await abrt(rq.body.dbsession);
			// delete rq.body.dbsession;
			return rs.status(200).send("Transaction aborted");
		} catch (e) {
			throws(e, "Forbidden. Invalid action", 403);
		}
	}),
	/**
	 * Ends an active session.
	 * @method POST
	 * @access protected admins only
	 * @route /api/v1/employee/end
	 * @type {import("./middlewares/d.cjs").Middleware<undefined, {dbsession: import("../server.cjs").DbSession}, Record<string, *>, undefined>}
	 */
	stop = asyncHandler(async function (rq, rs) {
		try {
			await end(rq.body.dbsession);
			// delete rq.body.dbsession;
			return rs.status(200).send("Session ended");
		} catch (e) {
			throws(e, "Forbidden. Invalid action", 403);
		}
	}),
	/**
	 * @typedef {{dbsession: import("../server.cjs").DbSession} & import("../data/employee.cjs").EmployeeDoc} PostBody
	 */
	/**
	 * Creates an employee on an active transaction.
	 * @method POST
	 * @access protected admins only
	 * @route /api/v1/employee/add
	 * @type {import("./middlewares/d.cjs").Middleware<undefined, PostBody, Record<string, *>, undefined>}
	 */
	post = asyncHandler(async function (rq, rs) {
		try {
			rq.body.dob = new Date(Date.parse(rq.body.dob));
			rq.body.sig = readFileSync(rq.body.sig, "binary");

			const e = await set(rq.body);
			// delete rq.body.dbsession;
			return rs.status(201).json(e);
			// return rs.status(201).json(rq.body);
		} catch (e) {
			throws(e, "Forbidden. Invalid action", 403);
		}
	}),
	/**
	 * Modifies an employee's data on an active transaction.
	 * @method PUT
	 * @access protected admins only
	 * @route /api/v1/employee/set
	 * @type {import("./middlewares/d.cjs").Middleware<undefined, {dbsession: import("../server.cjs").DbSession} & Record<string, any>, Record<string, *>, undefined>}
	 */
	put = asyncHandler(async function (rq, rs) {
		try {
			await mod(rq.body);
			// delete rq.body.dbsession;
			return rs.status(204);
		} catch (e) {
			throws(e, "Forbidden. Invalid action", 403);
		}
	}),
	/**
	 * Deletes an employee on an active transaction.
	 * @method DELETE
	 * @access protected admins only
	 * @route /api/v1/employee/delete
	 * @type {import("./middlewares/d.cjs").Middleware<undefined, {dbsession: import("../server.cjs").DbSession} & Record<string, any>, Record<string, *>, undefined>}
	 */
	dlt = asyncHandler(async function (rq, rs) {
		try {
			await del(rq.body);
			// delete rq.body.dbsession;
			return rs.status(204);
		} catch (e) {
			throws(e, "Forbidden. Invalid action", 403);
		}
	}),
	/**
	 * Gets an employee on an active transaction.
	 * @method GET
	 * @access protected admins only
	 * @route /api/v1/employee/:id
	 * @type {import("./middlewares/d.cjs").Middleware<{id: string}, {dbsession: import("../server.cjs").DbSession}, undefined, import("../models/employee.cjs").EmployeeSchemaConfig>}
	 */
	get = asyncHandler(async function (rq, rs) {
		try {
			// delete rq.body.dbsession;
			return rs.status(200).json(
				await gt({
					_id: new Types.ObjectId(rq.params.id)
				})
			);
		} catch (e) {
			throws(e, "Not found. Resource not found", 404);
		}
	});

module.exports = {
	init,
	start,
	commit,
	abort,
	stop,
	post,
	put,
	dlt,
	get
};
