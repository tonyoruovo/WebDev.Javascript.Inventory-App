const { Types } = require("mongoose");
const { Phone } = require("../models/phone.cjs");
const { v } = require("../repo/utility.cjs");

/**
 * An object containing reference(s) to composite types stored against an phone in the {@linkcode Phone} collection.
 * @typedef {Object} PhoneRef
 * @property {Types.ObjectId} phone a reference to the phone itself within the {@linkcode Phone} collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total phone.
 * @typedef {Object} PhoneDoc
 * @property {string} [n] alias for {@linkcode PhoneDoc.number}.
 * @property {string} [number] the actual number without any prefix or suffix.
 * @property {string} [iso="234"] the 3-letter iso country code for this phone number.
 * @property {number} [pref=0] the preference that this number holds amongst others in the phone number array. This preference
 * varies inversely with this value i.e `0` is the highest preference.
 * @property {"mobile" | "home" | "work" | "fax" | "emergency" | "main" | "alt" | "sec" | "direct" | "customer-support" | "sales" | "billing" | "technical-support" | "vendor" | "supplier" | "personal" | "other"} [type="mobile"] the type of phone number.
 */
/**
 * Adds the given phone to the {@linkcode Phone} collection.
 * @param {PhoneDoc | PhoneDoc[]} p the value to be added to the collection.
 * @returns {Promise<PhoneRef | PhoneRef[]>} a promise of references to the saved data.
 */
const add = async p => {
	if (Array.isArray(p)) return await bulkAdd(p);

	const n = p.n || p.number;
	if(!v(n)) Error("no number specified");
	else if(!/^\d\d{9}\d$/g.test(n)) Error("not a phone number");

	const _ = {};

	_.phone = (
		await new Phone({
			_id: new Types.ObjectId(Buffer.from(n)),
            _c: p.iso || "234",
            _pf: p.pref,
            _t: p.type
		}).save()
	)._id;

	return _;
};
/**
 * Adds the given phones to the {@linkcode Phone} collection.
 * @param {PhoneDoc[]} p the values to be added to the collection.
 * @returns {Promise<PhoneRef[]>} a promise of references to the saved data.
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
 * Retrieves this phone's details from a given session (memory) or from the {@linkcode Phone} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Phone}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * phone model.
 * @returns {Promise<import("../models/phone.cjs").PhoneSchemaConfig | import("../models/phone.cjs").PhoneSchemaConfig[]>}
 * an object with the phone id. Will be an array if the second argument is an array.
 */
const ret = async p => {
	if (Array.isArray(p)) return await bulkRet(p);
	return await Phone.findOne(p).select("-_id -_cAt -_uAt -_vk").exec();
};
/**
 * Retrieves the details of the given phone using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/phone.cjs").PhoneSchemaConfig[]>} An array of phone data for every sucessful query.
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
 * Deletes this phone from a given session (memory) or from the {@linkcode Phone} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Phone} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Phone.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Phone} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Phone} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this phone's details i.e updates an phone.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of phone to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/phone.cjs").PhoneSchemaConfig>} p.query the query to be run
 * which will actually modify the phone. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, PhoneSchemaConfig> & PhoneSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/phone.cjs").PhoneSchemaConfig>>} an object with the phone id
 */
const mod = async p => {
	return await Phone.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
	add,
	mod,
	rem,
	ret
};
