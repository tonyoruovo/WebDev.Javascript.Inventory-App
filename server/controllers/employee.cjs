const { Schema } = require("mongoose");

const asyncHandler = require("express-async-handler"),
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
			return rs.status(200).send("Session started");
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
			return rs.status(200).send("Transaction started");
		} catch (e) {
			throws(e, "Gone. Unable to start transaction", 410);
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
			return rs.status(200).send("Transaction started");
		} catch (e) {
			throws(e, "Gone. Unable to start transaction", 410);
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
			await set(rq.body.dbsession, rq.body);
			return rs.status(201).send("Created");
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
			await mod(rq.body.dbsession, rq.body);
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
			if (rq.body.dbsession.is()) await del(rq.body.dbsession, rq.body);
			else await del(undefined, rq.body);
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
			const id = new Schema.Types.ObjectId(rq.params.id);
            let val;
			if (rq.body.dbsession.is())
				val = gt(rq.body.dbsession, {
					$where: {
						_id: id
					}
				});
			else
				val = gt(undefined, {
					$where: {
						_id: id
					}
				});
			return rs.status(200).json(val);
		} catch (e) {
			throws(e, "Forbidden. Invalid action", 403);
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
