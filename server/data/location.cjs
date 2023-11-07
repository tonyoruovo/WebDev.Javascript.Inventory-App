
const { Types } = require("mongoose");
const { create } = require("../models/location.cjs");
const { v } = require("../repo/utility.cjs");
/**
 * An object containing reference(s) to composite types stored against a location in the {@linkcode Location} collection.
 * @typedef {Object} LocationRef
 * @property {Types.ObjectId} location
 * @property {Types.ObjectId} contact
 * @property {Types.ObjectId[]} paymentTerms
 */
/**
 * A contextual definition of a number.
 * @typedef {Object} Unit
 * @property {number} value the numerical value.
 * @property {string} unit the unit in which context the value is represented.
 */
/**
 * An object whose properties map to the {@linkcode Location} model, as such, is used to instantiate the model, which is stored in
 * a `Location` collection afterwards.
 * @typedef {Object} LocationDoc
 * @property {import("mongoose").Connection} connection The accompanying connection to the mongodb. This allows access to
 * the `Location` model via {@linkcode create()}.
 * @property {string} contact the id of the contact within the contact collection.
 * @property {string} descr any relevant description for this location.
 * @property {string[]} pics urls to the photos of this location.
 * @property {string} sig signature of the employee in-charge of this location.
 * @property {"pending" | "recieved" | "canceled" | "shipped" | "approved" | "in-progress" | "completed" | "failed" | "other"} [defaultStatus="other"] the default status for  this location.
 * @property {Unit} capacity the capacity of this location.
 * @property {string[]} pts an array of {@linkcode Types.ObjectId} objects as strings representing the payment terms
 */
/**
 * Adds the given location to the {@linkcode Location} collection.
 * @param {LocationDoc | LocationDoc[]} p the value to be added to the collection.
 * @returns {Promise<LocationRef | LocationRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};

    const Location = create(p.connection);
    const Unit = create(p.connection, false);

    _.paymentTerms = p.pts.map(x => new Types.ObjectId(x));

    _.contact = new Types.ObjectId(p.contact);

    const sig = v(p.sig) ? Buffer.from(p.sig, "binary") : undefined;

    _.location = (await new Location({
        _c: _.contact,
        _cp: new Unit({_u: p.capacity.unit, _v: p.capacity.value}),
        _d: p.descr,
        _ds: p.defaultStatus,
        _id: new Types.ObjectId(),
        _pc: p.pics,
        _pt: _.paymentTerms,
        _s: sig
    }).save())._id;

    p.connection.close();

    return _;
}
/**
 * Adds the given locations to the {@linkcode Location} collection.
 * @param {LocationDoc[]} p the values to be added to the collection.
 * @returns {Promise<LocationRef[]>} a promise of references to the saved data.
 */
const bulkAdd = async p => {
    const docs = [];
    for(const s of p){
        try {
            docs.push(await add(s));
        } catch (e) {
        }
    }
    return docs;
}
/**
 * Retrieves this location's details from a given session (memory) or from the {@linkcode Location} collection.
 * @param {Object} p the paramater object.
 * @param {Record<string, any> | Record<string, any>[]} p.query the mongoose query (predicate) whereby a singular {@linkcode Location}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * location model.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Location` model via {@linkcode create()}.
 * @returns {Promise<import("../models/location.cjs").LocationSchemaConfig | import("../models/location.cjs").LocationSchemaConfig[]>}
 * an object with the location id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    const Location = create(p.connection);
    if(Array.isArray(p.query)) return await bulkRet(p.query);
    const r = await Location.findOne(p.query)
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
    p.connection.close();
    return r;
}
/**
 * Retrieves the details of the given location using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/location.cjs").LocationSchemaConfig[]>} An array of location data for every sucessful query.
 */
const bulkRet = async p => {
    const docs = [];
    for(const s of p){
        try {
            docs.push(await ret(s));
        } catch (e) {
        }
    }
    return docs;
}

/**
 * Deletes this location from a given session (memory) or from the {@linkcode Location} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Location} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} p.id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Location` model via {@linkcode create()}.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async p => {
    const Location = create(p.connection);
	if (Array.isArray(p.id)) return await remBulk(p.id);
	const r = await Location.findByIdAndDelete(p.id).exec();
    p.connection.close();
    return r;
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Location} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Location} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this location's details i.e updates an location.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p.id the id of location to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/location.cjs").LocationSchemaConfig>} p.query the query to be run
 * which will actually modify the location. This is the modification query.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Location` model via {@linkcode create()}.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, LocationSchemaConfig> & LocationSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/location.cjs").LocationSchemaConfig>>} an object with the location id
 */
const mod = async p => {
    const Location = create(p.connection);
    const r = await Location.findByIdAndUpdate(p.id, p.query);
    p.connection.close();
    return r;
};

module.exports = {
    add, mod, rem, ret
}
