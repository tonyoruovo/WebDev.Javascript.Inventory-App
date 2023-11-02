const { Types } = require("mongoose");
const { Email } = require("../models/email.cjs");

/**
 * An object containing reference(s) to composite types stored against an email in the {@linkcode Email} collection.
 * @typedef {Object} EmailRef
 * @property {Types.ObjectId} email a reference to the email itself within the {@linkcode Email} collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total email.
 * @typedef {Object} EmailDoc
 * @property {string} [e] alias for {@linkcode EmailDoc.email}
 * @property {string} [email] the email
 */
/**
 * Adds the given email to the {@linkcode Email} collection.
 * @param {EmailDoc | EmailDoc[]} p the value to be added to the collection.
 * @returns {Promise<EmailRef | EmailRef[]>} a promise of references to the saved data.
 */
const add = async p => {
	if (Array.isArray(p)) return await bulkAdd(p);

	const _ = {};

	_.email = (
		await new Email({
			_id: new Types.ObjectId(Buffer.from(p.e||p.email, "utf8"))
		}).save()
	)._id;

	return _;
};
/**
 * Adds the given emails to the {@linkcode Email} collection.
 * @param {EmailDoc[]} p the values to be added to the collection.
 * @returns {Promise<EmailRef[]>} a promise of references to the saved data.
 */
const bulkAdd = async p => {
	const docs = [];
	for (const s of p) {
		try {
			docs.push(await add(s));
		} catch (e) {}
	}
	return docs;
};
/**
 * Retrieves this email's details from a given session (memory) or from the {@linkcode Email} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Email}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * email model.
 * @returns {Promise<import("../models/email.cjs").EmailSchemaConfig | import("../models/email.cjs").EmailSchemaConfig[]>}
 * an object with the email id. Will be an array if the second argument is an array.
 */
const ret = async p => {
	if (Array.isArray(p)) return await bulkRet(p);
	return await Email.findOne(p).select("-_cAt -_uAt -_vk").exec();
};
/**
 * Retrieves the details of the given email using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/email.cjs").EmailSchemaConfig[]>} An array of email data for every sucessful query.
 */
const bulkRet = async p => {
	const docs = [];
	for (const s of p) {
		try {
			docs.push(await ret(s));
		} catch (e) {}
	}
	return docs;
};

/**
 * Deletes this email from a given session (memory) or from the {@linkcode Email} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Email} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Email.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Email} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Email} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId[]} ids an arrays of object id of the values to be deleted
 * @returns {Promise<any[]>} any value
 */
const remBulk = async ids => {
	const docs = [];
	for (const x of ids) {
		docs.push(await rem(x));
	}
	return docs;
};
/**
 * Modifies this email's details i.e updates an email.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of email to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/email.cjs").EmailSchemaConfig>} p.query the query to be run
 * which will actually modify the email. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, EmailSchemaConfig> & EmailSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/email.cjs").EmailSchemaConfig>>} an object with the email id
 */
const mod = async p => {
	return await Email.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
	add,
	mod,
	rem,
	ret
};
