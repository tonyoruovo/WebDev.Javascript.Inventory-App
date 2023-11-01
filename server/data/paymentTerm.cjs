
const { Types } = require("mongoose");
const { PaymentTerm } = require("../models/paymentTerm.cjs");

/**
 * An object containing reference(s) to composite types stored against a paymentTerm in the {@linkcode PaymentTerm} collection.
 * @typedef {Object} PaymentTermRef
 * @property {Types.ObjectId} paymentTerm a reference to the paymentTerm itself within the {@linkcode PaymentTerm} collection.
 * @property {Types.ObjectId[]} amounts the reference to the amounts. 
 */
/**
 * An Object whose properties map to the {@linkcode PaymentTerm} model, as such, is used to instantiate the model, which is added
 * to an array of the {@linkcode PaymentTerm}.
 * @typedef {Object} PaymentTermDoc
 * @property {string} t_c the terms and conditions regarding this payment term. This is required.
 * @property {number} [period] a number relating to the duration of the payment. If this value is `4` and {@linkcode PaymentTermDoc.interval}
 * is `'day'`, then payment is expected the amount given will be split into 4 days. This is required only if this term is a partial
 * payment plan and `interval` is set.
 * @property {"second" | "minute" | "hour" | "day" | "week" | "month" | "year" | "decade"} [interval="day"] the unit of time being used for partial
 * payments.
 * @property {string[]} amounts an array of {@linkcode Types.ObjectId} objects as strings representing all deductions, reductions, prices, taxes, bills, charges, promos etc.
 * @property {"cheque" | "check" | "cash" | "wire" | "credit" | "etf"} paymentType the payment method. the `"etf"` option stands for
 * *E*lectronic *T*ransfer *F*unds these include (paypal, verve, interswitch, crypto etc).
 * @property {string[]} codes important codes and numbers related to this payment term, for example account numbers, transfer
 * tokens, wallet ids etc. The alias is `paymentCodes`.
 */
/**
 * Adds the given paymentTerm to the {@linkcode PaymentTerm} collection.
 * @param {PaymentTermDoc | PaymentTermDoc[]} p the value to be added to the collection.
 * @returns {Promise<PaymentTermRef | PaymentTermRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};

    _.amounts = p.amounts.map(x => new Types.ObjectId(x));

    _.paymentTerm = ((await new PaymentTerm({
        _id: new Types.ObjectId(),
        _a: _.amounts,
        _ic: p.codes,
        _it: p.interval,
        _prd: p.period,
        _tc: p.t_c,
        _ty: p.paymentType
    }).save())._id);

    return _;
}
/**
 * Adds the given paymentTerms to the {@linkcode PaymentTerm} collection.
 * @param {PaymentTermDoc[]} p the values to be added to the collection.
 * @returns {Promise<PaymentTermRef[]>} a promise of references to the saved data.
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
 * Retrieves this paymentTerm's details from a given session (memory) or from the {@linkcode PaymentTerm} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode PaymentTerm}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * paymentTerm model.
 * @returns {Promise<import("../models/paymentTerm.cjs").PaymentTermSchemaConfig | import("../models/paymentTerm.cjs").PaymentTermSchemaConfig[]>}
 * an object with the paymentTerm id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    if(Array.isArray(p)) return await bulkRet(p);
    return await PaymentTerm.findOne(p)
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
}
/**
 * Retrieves the details of the given paymentTerm using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/paymentTerm.cjs").PaymentTermSchemaConfig[]>} An array of paymentTerm data for every sucessful query.
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
 * Deletes this paymentTerm from a given session (memory) or from the {@linkcode PaymentTerm} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode PaymentTerm} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await PaymentTerm.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode PaymentTerm} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode PaymentTerm} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this paymentTerm's details i.e updates an paymentTerm.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of paymentTerm to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/paymentTerm.cjs").PaymentTermSchemaConfig>} p.query the query to be run
 * which will actually modify the paymentTerm. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, PaymentTermSchemaConfig> & PaymentTermSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/paymentTerm.cjs").PaymentTermSchemaConfig>>} an object with the paymentTerm id
 */
const mod = async p => {
    return await PaymentTerm.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
    add, mod, rem, ret
}
