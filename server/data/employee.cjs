const { Types } = require("mongoose");
const { Employee } = require("../models/employee.cjs");

/**
 * A reference to a created {@linkcode Employee} model inside a transaction that is yet to saved and committed.
 * To save a reference, do:
 * ```ts
 * const s: DbObject = ...
 * const doc: EmployeeDoc = employeeDoc();//an external object from a network/stream?
 * const ef: EmployeeRef = await set(p);
 * PersonName.findOne({_id: ef.fullname}: Record<string, any>).session(s).save();
 * Account.findOne({_id: ef.account}: Record<string, any>).session(s).save();
 * Contact.findOne({_id: ef.contact}: Record<string, any>).session(s).save();
 * Employee.findOne({_id: ef.employee}: Record<string, any>).session(s).save();
 * ```
 * @typedef {Object} EmployeeRef
 * @property {import("mongoose").Schema.Types.ObjectId} subject a reference to a `Subject` model that is yet to be saved
 * @property {import("mongoose").Schema.Types.ObjectId} employee a reference to an {@linkcode Employee} model that is yet to be saved
 */
/**
 * A js object with the neccessary properties for creating an {@link Employee}.
 * @typedef {Object} EmployeeDoc
 * @property {string} [sig] the image data of the signature of this employee as a `string`.
 * @property {string} subject {@linkcode Types.ObjectId} as a string representing the signature of this employee.
 * @property {string} s alias for {@linkcode EmployeeDoc.subject}
 */
/**
 * Creates a new employee in memory. This does not save this object to the database. That must be done in a separate action,
 * using the provided ids returned by this object.
 * @todo Verify email and phone in the data/contact.cjs file
 * @alias createEmployee
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {EmployeeDoc | EmployeeDoc[]} p the employee(s) to be created
 * @returns {Promise<EmployeeRef | EmployeeRef[]>} a js object of the ids of unsaved values
 */
const set = async p => {
	if (Array.isArray(p)) {
		return await bulkSet(p);
	}

	const _ = {};

	_.subject = new Types.ObjectId(p.subject);

	_.employee = (await new Employee({
		_id: new Types.ObjectId(),
		_s: _.subject,
		_sig: Buffer.from(p.sig, "binary")
	}).save())._id;

	return _;
};
/**
 * Creates multiple employees.
 * @alias createEmployees
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {EmployeeDoc[]} p the employee to be created
 * @returns {Promise<EmployeeRef[]>} an array of js objects of the ids of unsaved values
 */
const bulkSet = async p => {
	const docs = [];
	for (const x of p) {
		docs.push(await set(x));
	}
	return docs;
};
/**
 * Modifies this employee's details i.e updates an employee.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of employee to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/employee.cjs").EmployeeSchemaConfig>} p.query the query to be run
 * which will actually modify the employee. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, EmployeeSchemaConfig> & EmployeeSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/employee.cjs").EmployeeSchemaConfig>>} an object with the employee id
 */
const mod = async p => {
	return await Employee.findByIdAndUpdate(p._id, p.query);
};
/**
 * Retrieves this employee's details from a given session (memory) or from the {@linkcode Employee} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the retrieval is meant
 * to be done on the {@linkcode Employee} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be returned.
 * @param {Record<string, any> | Record<string, any>[]} p the condition (predicate) whereby a singular {@linkcode Employee}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * employee model.
 * @returns {Promise<import("../models/employee.cjs").EmployeeSchemaConfig | import("../models/employee.cjs").EmployeeSchemaConfig[]>}
 * an object with the employee id. Will be an array if the second argument is an array.
 */
const get = async p => {
	if (Array.isArray(p)) return bulkGet(p);
	return await Employee.findOne(p)
		.populate({
			path: "_a",
			model: "Account",
			select: "_u -_id"
		})
		.populate({
			path: "_c",
			model: "Contact",
			select: "-_id -_cAt -_uAt -_vk",
			populate: {
				path: "_n",
				select: "-_id -_cAt -_uAt -_vk"
			}
		})
		.select("-_s -_id -_cAt -_uAt -_vk")
		.exec();
};
/**
 * Retrieves an array of employee's details from a given session (memory) or from the {@linkcode Employee} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the retrieval is meant
 * to be done on the {@linkcode Employee} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be returned.
 * @param {Record<string, any> | Record<string, any>[]} p the condition (predicate) whereby a singular {@linkcode Employee}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * employee model.
 * @returns {import("../models/employee.cjs").EmployeeSchemaConfig[]} array of objects each with the employee id
 */
const bulkGet = p => {
	const docs = [];
	for (const x of p) {
		docs.push(get(x));
	}
	return docs;
};
/**
 * Deletes this employee from a given session (memory) or from the {@linkcode Employee} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Employee} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const del = async id => {
	if (Array.isArray(id)) return delBulk(id);
	return await Employee.findByIdAndDelete(id).exec();
};
/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Employee} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Employee} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId[]} ids an arrays of object id of the values to be deleted
 * @returns {Promise<any[]>} any value
 */
const delBulk = async ids => {
	const docs = [];
	for (const x of ids) {
		docs.push(await del(x));
	}
	return docs;
};
/**
 * Creates a new session for the {@linkcode Employee} model on the given argument.
 * @alias initializeSession
 * @param {import("../server.cjs").DbObject} m the session object
 * @return {Promise<import("../server.cjs").DbObject>} the same object whose session was instantiated.
 */
const ini = async m => {
	if (!m.is()) {
		m.s = await m.con.startSession();
		// console.log(m.s);
		m.n = Employee.name;
	}
	return m;
};
/**
 * Starts a transaction for the session for the {@linkcode Employee} model on the given argument.
 * @alias startTransaction
 * @param {import("../server.cjs").DbObject} m the session object
 * @return {true | never} `true` indicating that the transaction has started or will throw an error indicating an invalid state.
 */
const strt = m => {
	if (!m.is()) throw Error("No transaction found");
	m.s.startTransaction();
	return true;
};
/**
 * Aborts a transaction for the session for the {@linkcode Employee} model on the given argument.
 * @alias abortTransaction
 * @param {import("../server.cjs").DbObject} m the session object
 * @return {Promise<Record<string, any>>}
 */
const abrt = async m => {
	if (!m.is()) throw Error("No transaction found");
	return await m.s.abortTransaction();
};
/**
 * Commits a transaction for the session for the {@linkcode Employee} model on the given argument.
 * @alias commitTransaction
 * @param {import("../server.cjs").DbObject} m the session object
 * @return {Promise<Record<string, any>>} any mongoose document that is being saved by this commit.
 */
const cmt = async m => {
	if (!m.is()) throw Error("No transaction found");
	return await m.s.commitTransaction();
};
/**
 * Terminates the session for the model on the given argument.
 * @alias endSession
 * @param {import("../server.cjs").DbObject} m the session object
 * @return {Promise<import("../server.cjs").DbObject>} the same object whose session was ended.
 */
const end = async m => {
	await m.end();
	return m;
};

module.exports = {
	del,
	gt: get,
	mod,
	set,
	ini,
	strt,
	cmt,
	end,
	abrt
};
