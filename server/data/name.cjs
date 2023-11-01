const { Types } = require("mongoose");
const { Name } = require("../models/name.cjs");

/**
 * An object containing reference(s) to composite types stored against an name in the {@linkcode Name} collection.
 * @typedef {Object} NameRef
 * @property {Types.ObjectId} name a reference to the name itself within the {@linkcode Name} collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total name.
 * @typedef {import("../models/name.cjs").NameDoc} NameDoc
 */
/**
 * Adds the given name to the {@linkcode Name} collection.
 * @param {NameDoc | NameDoc[]} p the value to be added to the collection.
 * @returns {Promise<NameRef | NameRef[]>} a promise of references to the saved data.
 */
const add = async p => {
	if (Array.isArray(p)) return await bulkAdd(p);

	const _ = {};

	_.name = (
		await new Name({
			_id: new Types.ObjectId(),
            _n: p
		}).save()
	)._id;

	return _;
};
/**
 * Adds the given names to the {@linkcode Name} collection.
 * @param {NameDoc[]} p the values to be added to the collection.
 * @returns {Promise<NameRef[]>} a promise of references to the saved data.
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
 * Retrieves this name's details from a given session (memory) or from the {@linkcode Name} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Name}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * name model.
 * @returns {Promise<import("../models/name.cjs").NameSchemaConfig | import("../models/name.cjs").NameSchemaConfig[]>}
 * an object with the name id. Will be an array if the second argument is an array.
 */
const ret = async p => {
	if (Array.isArray(p)) return await bulkRet(p);
	return await Name.findOne(p).select("-_id -_cAt -_uAt -_vk").exec();
};
/**
 * Retrieves the details of the given name using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/name.cjs").NameSchemaConfig[]>} An array of name data for every sucessful query.
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
 * Deletes this name from a given session (memory) or from the {@linkcode Name} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Name} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Name.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Name} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Name} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this name's details i.e updates an name.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of name to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/name.cjs").NameSchemaConfig>} p.query the query to be run
 * which will actually modify the name. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, NameSchemaConfig> & NameSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/name.cjs").NameSchemaConfig>>} an object with the name id
 */
const mod = async p => {
	return await Name.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
	add,
	mod,
	rem,
	ret
};
