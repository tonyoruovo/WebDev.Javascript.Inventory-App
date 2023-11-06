
const { Types } = require("mongoose");
const { create } = require("../models/amount.cjs");

/**
 * An object containing reference(s) to composite types stored against an amount in the {@linkcode Amount} collection.
 * @typedef {Object} AmountRef
 * @property {Types.ObjectId} amount a reference to the amount itself within the {@linkcode Amount} collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total amount.
 * @typedef {Object} AmountDoc
 * @property {import("mongoose").Connection} connection The accompanying connection to the mongodb. This allows access to
 * the `Amount` model via {@linkcode create()}.
 * @property {string} [iso="566"] the 3-letter ISO currency code for the currency being used for this transaction. The default is the code
 * `"566"` which is the currency code for the Nigerian Naira.
 * @property {"a" | "add" | "subtract" | "s" | "multiply" | "m" | "divide" | "d" | "sqrt" | "cbrt" | "exp" | "percent" | "log"} [type="add"]
 * The type of relation this will have to the total (base) amount. For example, if this value is `"add"`, then the {@linkcode AmountDoc.value}
 * property will be added to base amount.
 * @property {number} value the numerical representation of this amount.
 * @property {string | number} [expiresAt] for time-sensitive bills, promos and deductables. Specifies the time stamp for the expiration of
 * this amount. This is a {@linkcode Date} string value.
 * @property {string} [comments] any relevant info that should be included.
 * @property {string} [comment] an alias for {@linkcode AmountDoc.comments}.
 */
/**
 * Adds the given amount to the {@linkcode Amount} collection.
 * @param {AmountDoc | AmountDoc[]} p the value to be added to the collection.
 * @returns {Promise<AmountRef | AmountRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};

    const Amount = create(p.connection);

    _.amount = ((await new Amount({
        _id: new Types.ObjectId(),
        _cc: p.iso || "566",
        _ct: p.comment || p.comments,
        _expiresAt: new Date(p.expiresAt || Date.now()),
        _t: p.type || "add",
        _v: p.value
    }).save())._id);

    return _;
}
/**
 * Adds the given amounts to the {@linkcode Amount} collection.
 * @param {AmountDoc[]} p the values to be added to the collection.
 * @returns {Promise<AmountRef[]>} a promise of references to the saved data.
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
 * Retrieves this amount's details from a given session (memory) or from the {@linkcode Amount} collection.
 * @param {Object} p the parameter object.
 * @param {Record<string, any> | Record<string, any>[]} p.query the mongoose query (predicate) whereby a singular {@linkcode Amount}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * amount model.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Amount` model via {@linkcode create()}.
 * @returns {Promise<import("../models/amount.cjs").AmountSchemaConfig | import("../models/amount.cjs").AmountSchemaConfig[]>}
 * an object with the amount id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    const Amount = create(p.connection);
    if(Array.isArray(p.query)) return await bulkRet(p.query);
    return await Amount.findOne(p.query)
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
}
/**
 * Retrieves the details of the given amount using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/amount.cjs").AmountSchemaConfig[]>} An array of amount data for every sucessful query.
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
 * Deletes this amount from a given session (memory) or from the {@linkcode Amount} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Amount} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {Object} p the parameter object
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} p.id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Amount` model via {@linkcode create()}.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async p => {
    const Amount = create(p.connection);
	if (Array.isArray(p.id)) return await remBulk(p.id);
	return await Amount.findByIdAndDelete(p.id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Amount} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Amount} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this amount's details i.e updates an amount.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p.id the id of amount to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/amount.cjs").AmountSchemaConfig>} p.query the query to be run
 * which will actually modify the amount. This is the modification query.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Amount` model via {@linkcode create()}.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, AmountSchemaConfig> & AmountSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/amount.cjs").AmountSchemaConfig>>} an object with the amount id
 */
const mod = async p => {
    const Amount = create(p.connection);
    return await Amount.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
    add, mod, rem, ret
}
