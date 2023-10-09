const { Schema } = require("mongoose");
const { Employee } = require("../models/employee.cjs");
const { Contact } = require("../models/contact");
const { Address } = require("../models/address.cjs");
const { Email } = require("../models/email.cjs");
const { default: PersonName } = require("../models/name.cjs");
const { Phone } = require("../models/phone.cjs");
const { Account } = require("../models/account.cjs");
const { v } = require("../repos/utility.cjs");

/**
 * A reference to a created {@linkcode Employee} model inside a transaction that is yet to saved and committed.
 * To save a reference, do:
 * ```ts
 * const s: DbSession = ...
 * const doc: EmployeeDoc = employeeDoc();//an external object from a network/stream?
 * const ef: EmployeeRef = await set(p);
 * PersonName.findOne({_id: ef.fullname}: Record<string, any>).session(s).save();
 * Account.findOne({_id: ef.account}: Record<string, any>).session(s).save();
 * Contact.findOne({_id: ef.contact}: Record<string, any>).session(s).save();
 * Employee.findOne({_id: ef.employee}: Record<string, any>).session(s).save();
 * ```
 * @typedef {Object} EmployeeRef
 * @property {Schema.Types.ObjectId} fullname a reference to a {@linkcode PersonName} model that is yet to be saved
 * @property {Schema.Types.ObjectId} account a reference to an {@linkcode Account} model that is yet to be saved
 * @property {Schema.Types.ObjectId} contact a reference to a {@linkcode Contact} model that is yet to be saved
 * @property {Schema.Types.ObjectId} employee a reference to an {@linkcode Employee} model that is yet to be saved
 */
/**
 * A js object with the neccessary properties for creating an {@link Employee}.
 * @typedef {Object} EmployeeDoc
 * @property {Date} dob the date of birth
 * @property {"male" | "female"} gender the gender of the employee
 * @property {Object} contact the contact of this employee
 * @property {Object} contact.fullname the fullname of this employee
 * @property {string} contact.fullname.name the first name of this employee
 * @property {string[]} [contact.fullname.others] middle names and other names that are not the first name, surname or title of this
 * individual.
 * @property {string} contact.fullname.surname the surname of this employee
 * @property {string[]} [contact.fullname.preTitles] the titles of this employee that may be prepended to the fullname
 * @property {string[]} [contact.fullname.postTitles] the titles of this employee that may be appended to the fullname
 * @property {Object} contact.ad the address data of the employee
 * @property {string} contact.ad.street the street of the employee
 * @property {string} [contact.ad.landmark] any landmark useful in identifying the street of the employee
 * @property {string} contact.ad.city the city where the street of the employee resides.
 * @property {string} contact.ad.zip the zip code of the city where the street of the employee resides.
 * @property {string} contact.ad.lga the local government area of the city where the street of the employee resides.
 * @property {string} contact.ad.state the state or region where the city of the employee resides.
 * @property {string} contact.ad.countryCode the country where the employee resides.
 * @property {string} contact.ad.comments any neccessary comments.
 * @property {string} contact.email The email of this employee.
 * @property {string[]} contact.socials The urls to social media account of this employee.
 * @property {Object} contact.phone The phone number of this employee.
 * @property {string} contact.phone.number The locale specific phone number of this employee without any international code
 * preceding it.
 * @property {number} contact.phone.preference The preference of this phone number.
 * @property {string} contact.phone.iso The 3-letter country code of this phone number.
 * @property {"mobile" | "home" | "work" | "fax" | "emergency" | "main" | "alt" | "sec" | "direct" | "customer-support" | "sales" | "billing" | "technical-support" | "vendor" | "supplier" | "personal" | "other"} contact.phone.type The type of this phone number, which maybe work, personal home etc.
 * @property {string} contact.notes Addtional neccessary info about this contact.
 * @property {"call" | "sms" | "email" | "social" | "other"} contact.preferredMethod The preferred way in which the owner wants to be contacted.
 * @property {string[]} contact.pics The internal url to prfile pictures.
 * @property {Object} ac the account data of the employee
 * @property {string} ac.username the username
 * @property {string} ac.password the password
 * @property {Buffer} [sig] the signature of this employee
 */
/**
 * Creates a new employee in memory. This does not save this object to the database. That must be done in a separate action,
 * using the provided ids returned by this object.
 * @todo Verify email and phone in the data/contact.cjs file
 * @alias createEmployee
 * @param {import("../server.cjs").DbSession} m the session object
 * @param {EmployeeDoc | EmployeeDoc[]} p the employee(s) to be created
 * @returns {Promise<EmployeeRef | EmployeeRef[]>} a js object of the ids of unsaved values
 */
const set = async (m, p) => {
	if (Array.isArray(p)) {
		return await bulkSet(m, p);
	}
	const ad = new Address({
		_id: new Schema.ObjectId(),
		_c: p.contact.ad.city,
		_cc: p.contact.ad.countryCode ?? p.contact.phone.iso,
		_com: p.contact.ad.comments,
		_l: p.contact.ad.landmark,
		_lg: p.contact.ad.lga,
		_s: p.contact.ad.street,
		_st: p.contact.ad.state,
		_z: p.contact.ad.zip
	});
	const email = new Email({ _e: p.contact.email, _id: new Schema.ObjectId() });
	const phone = new Phone({
		_id: new Schema.ObjectId(),
		_c: p.contact.ad.countryCode ?? p.contact.phone.iso,
		_n: p.contact.phone.number,
		_pf: p.contact.phone.preference,
		_t: p.contact.phone.type
	});
	const fullname = await PersonName.create(
		{
			_id: new Schema.ObjectId(),
			_n: {
				name: p.contact.fullname.name,
				surname: p.contact.fullname.surname,
				others: p.contact.fullname.others,
				preTitles: p.contact.fullname.preTitles,
				postTitles: p.contact.fullname.postTitles
			}
		},
		{ session: m.s }
	);
	const ac = await Account.create(
		{
			_id: new Schema.ObjectId(),
			_h: p.ac.password,
			_s: "pending",
			_u: p.ac.username
		},
		{ session: m.s }
	);
	const contact = await Contact.create(
		{
			_id: new Schema.ObjectId(),
			_nt: p.contact.notes,
			_pm: p.contact.preferredMethod,
			_pp: p.contact.pics,
			_s: p.contact.socials,
			_a: [ad],
			_e: [email],
			_n: fullname._id,
			_p: [phone]
		},
		{ session: m.s }
	);
	const emp = await Employee.create(
		{
			_g: p.gender,
			_dob: p.dob,
			_id: new Schema.ObjectId(),
			_s: p.sig,
			_a: ac._id,
			_c: contact._id
		},
		{ session: m.s }
	);
	return {
		fullname: fullname._id,
		account: ac._id,
		contact: contact._id,
		employee: emp._id
	};
};
/**
 * Creates multiple employees.
 * @alias createEmployees
 * @param {import("../server.cjs").DbSession} m the session object
 * @param {EmployeeDoc[]} p the employee to be created
 * @returns {Promise<EmployeeRef[]>} an array of js objects of the ids of unsaved values
 */
const bulkSet = async (m, p) => {
	const docs = [];
	for (const x of p) {
		docs.push(await set(m, x));
	}
	return docs;
};
/**
 * Modifies this employee's details i.e updates an employee.
 * @param {import("../server.cjs").DbSession} m the session object
 * @param {Object} p the parameter options
 * @param {Schema.Types.ObjectId} p._id the id of employee to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/employee.cjs").EmployeeSchemaConfig>} p.query the query to be run
 * which will actually modify the employee. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, EmployeeSchemaConfig> & EmployeeSchemaConfig & Required<{_id: Schema.Types.ObjectId}>, import("../models/employee.cjs").EmployeeSchemaConfig>>} an object with the employee id
 */
const mod = async (m, p) => {
	return await Employee.findByIdAndUpdate(p._id, p.query, { session: m.s });
};
/**
 * Retrieves this employee's details from a given session (memory) or from the {@linkcode Employee} collection.
 * @param {import("../server.cjs").DbSession} m the session object. Should be `null` or `undefined` if the retrieval is meant
 * to be done on the {@linkcode Employee} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be returned.
 * @param {Record<string, any> | Record<string, any>[]} p the condition (predicate) whereby a singular {@linkcode Employee}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * employee model.
 * @returns {import("../models/employee.cjs").EmployeeSchemaConfig | import("../models/employee.cjs").EmployeeSchemaConfig[]}
 * an object with the employee id. Will be an array if the second argument is an array.
 */
const get = (m, p) => {
	if (Array.isArray(p)) return bulkGet(m, p);
	if (v(m)) {
		return Employee.findOne(p)
			.session(m.s)
			.populate({
				path: "_a",
				model: "Account",
				select: "_u"
			})
			.populate({
				path: "_c",
				model: "Contact"
			})
			.select("-_id -createdAt -updatedAt -__v -password")
			.exec();
	}
	return Employee.findOne(p)
		.populate({
			path: "_a",
			model: "Account",
			select: "_u"
		})
		.populate({
			path: "_c",
			model: "Contact"
		})
		.select("-_id -createdAt -updatedAt -__v -password")
		.exec();
};
/**
 * Retrieves an array of employee's details from a given session (memory) or from the {@linkcode Employee} collection.
 * @param {import("../server.cjs").DbSession} m the session object. Should be `null` or `undefined` if the retrieval is meant
 * to be done on the {@linkcode Employee} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be returned.
 * @param {Record<string, any> | Record<string, any>[]} p the condition (predicate) whereby a singular {@linkcode Employee}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * employee model.
 * @returns {import("../models/employee.cjs").EmployeeSchemaConfig[]} array of objects each with the employee id
 */
const bulkGet = (m, p) => {
	const docs = [];
	for (const x of p) {
		docs.push(get(m, x));
	}
	return docs;
};
/**
 * Deletes this employee from a given session (memory) or from the {@linkcode Employee} collection.
 * @param {import("../server.cjs").DbSession} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Employee} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {Schema.Types.ObjectId | Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {any | any[]} any value
 */
const del = (m, id) => {
	if (Array.isArray(id)) return delBulk(m, id);
	return Employee.findByIdAndDelete(id, { session: v(m) ? m.s : undefined });
};
/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Employee} collection.
 * @param {import("../server.cjs").DbSession} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Employee} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {Schema.Types.ObjectId[]} ids an arrays of object id of the values to be deleted
 * @returns {any[]} any value
 */
const delBulk = (m, ids) => {
	const docs = [];
	for (const x of ids) {
		docs.push(del(m, x));
	}
	return docs;
};
/**
 * Creates a new session for the {@linkcode Employee} model on the given argument.
 * @alias initializeSession
 * @param {import("../server.cjs").DbSession} m the session object
 * @return {Promise<import("../server.cjs").DbSession>} the same object whose session was instantiated.
 */
const ini = async m => {
	if (!m.is()) {
		m = await Employee.startSession({ snapshot: true });
		m.n = Employee.name;
	}
	return m;
};
/**
 * Starts a transaction for the session for the {@linkcode Employee} model on the given argument.
 * @alias startTransaction
 * @param {import("../server.cjs").DbSession} m the session object
 * @return {true | never} `true` indicating that the transaction has started or will throw an error indicating an invalid state.
 */
const strt = m => {
	m.s.startTransaction();
	return true;
};
/**
 * Aborts a transaction for the session for the {@linkcode Employee} model on the given argument.
 * @alias abortTransaction
 * @param {import("../server.cjs").DbSession} m the session object
 * @return {Promise<Record<string, any>>}
 */
const abrt = async m => {
	return await m.s.abortTransaction();
};
/**
 * Commits a transaction for the session for the {@linkcode Employee} model on the given argument.
 * @alias commitTransaction
 * @param {import("../server.cjs").DbSession} m the session object
 * @return {Promise<Record<string, any>>} any mongoose document that is being saved by this commit.
 */
const cmt = async m => {
	return await m.s.commitTransaction();
};
/**
 * Terminates the session for the model on the given argument.
 * @alias endSession
 * @param {import("../server.cjs").DbSession} m the session object
 * @return {Promise<import("../server.cjs").DbSession>} the same object whose session was ended.
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
