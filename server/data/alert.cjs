
const { Types } = require("mongoose");
const { Alert } = require("../models/alert.cjs");
/**
 * @typedef {Object} AlertRef
 * @property {Types.ObjectId} alert
 */
/**
 * An object whose properties map to the {@linkcode Alert} model, as such, is used to instantiate the model, which is stored in
 * an `Alert` collection afterwards.
 * @typedef {Object} AlertDoc
 * @property {"low-stock" | "expiration" | "confirm" | "shipment" | "payment" | "error" | "security" | "other"} type the type of alert.
 * @property {string} msg The alert message that is constructed by hand.
 */
/**
 * Adds the given alert to the {@linkcode Alert} collection.
 * @param {AlertDoc | AlertDoc[]} p the value to be added to the collection.
 * @returns {Promise<AlertRef | AlertRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};

    _.alert = ((await new Alert({
        _id: new Types.ObjectId(),
        _m: p.msg,
        _t: p.type
    }).save())._id);

    return _;
}
/**
 * Adds the given alerts to the {@linkcode Alert} collection.
 * @param {AlertDoc[]} p the values to be added to the collection.
 * @returns {Promise<AlertRef[]>} a promise of references to the saved data.
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
 * Retrieves this alert's details from a given session (memory) or from the {@linkcode Alert} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Alert}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * alert model.
 * @returns {Promise<import("../models/alert.cjs").AlertSchemaConfig | import("../models/alert.cjs").AlertSchemaConfig[]>}
 * an object with the alert id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    if(Array.isArray(p)) return await bulkRet(p);
    return await Alert.findOne(p)
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
}
/**
 * Retrieves the details of the given alert using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/alert.cjs").AlertSchemaConfig[]>} An array of alert data for every sucessful query.
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
 * Deletes this alert from a given session (memory) or from the {@linkcode Alert} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Alert} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Alert.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Alert} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Alert} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this alert's details i.e updates an alert.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of alert to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/alert.cjs").AlertSchemaConfig>} p.query the query to be run
 * which will actually modify the alert. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, AlertSchemaConfig> & AlertSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/alert.cjs").AlertSchemaConfig>>} an object with the alert id
 */
const mod = async p => {
    return await Alert.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
    add, mod, rem, ret
}
