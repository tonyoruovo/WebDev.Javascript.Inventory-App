
const { Types } = require("mongoose");
const { Transaction } = require("../models/transaction.cjs");

/**
 * An object containing reference(s) to composite types stored against an transaction in the {@linkcode Transaction} collection.
 * @typedef {Object} TransactionRef
 * @property {Types.ObjectId} transaction a reference to the transaction itself within the {@linkcode Transaction} collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total transaction.
 * @typedef {Object} TransactionDoc
 * @property {string} msg any related comments, complaints, review, message etc for this transaction
 * @property {string} e The id of the employee that approved (is responsible for) this transaction
 * @property {string} l The id of the location from which this product will be shipped.
 * @property {string} oid The id of the order to which this transaction is responding to.
 * @property {string[]} amounts {@linkcode Types.ObjectId} as a string representing additional transaction-wide deductions, promos.
 */
/**
 * Adds the given transaction to the {@linkcode Transaction} collection.
 * @param {TransactionDoc | TransactionDoc[]} p the value to be added to the collection.
 * @returns {Promise<TransactionRef | TransactionRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};

    _.transaction = ((await new Transaction({
        _id: new Types.ObjectId(),
        _c: p.msg,
        _e: new Types.ObjectId(p.e),
        _l: new Types.ObjectId(p.l),
        _oid: new Types.ObjectId(p.oid),
        _ta: p.amounts.map(x => new Types.ObjectId(x)),
    }).save())._id);

    return _;
}
/**
 * Adds the given transactions to the {@linkcode Transaction} collection.
 * @param {TransactionDoc[]} p the values to be added to the collection.
 * @returns {Promise<TransactionRef[]>} a promise of references to the saved data.
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
 * Retrieves this transaction's details from a given session (memory) or from the {@linkcode Transaction} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Transaction}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * transaction model.
 * @returns {Promise<import("../models/transaction.cjs").TransactionSchemaConfig | import("../models/transaction.cjs").TransactionSchemaConfig[]>}
 * an object with the transaction id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    if(Array.isArray(p)) return await bulkRet(p);
    return await Transaction.findOne(p)
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
}
/**
 * Retrieves the details of the given transaction using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/transaction.cjs").TransactionSchemaConfig[]>} An array of transaction data for every sucessful query.
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
 * Deletes this transaction from a given session (memory) or from the {@linkcode Transaction} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Transaction} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Transaction.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Transaction} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Transaction} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this transaction's details i.e updates an transaction.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of transaction to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/transaction.cjs").TransactionSchemaConfig>} p.query the query to be run
 * which will actually modify the transaction. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, TransactionSchemaConfig> & TransactionSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/transaction.cjs").TransactionSchemaConfig>>} an object with the transaction id
 */
const mod = async p => {
    return await Transaction.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
    add, mod, rem, ret
}
