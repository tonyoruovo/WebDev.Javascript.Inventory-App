
const { Types } = require("mongoose");
const { create } = require("../models/transaction.cjs");

/**
 * An object containing reference(s) to composite types stored against an transaction in the {@linkcode Transaction} collection.
 * @typedef {Object} TransactionRef
 * @property {Types.ObjectId} transaction a reference to the transaction itself within the {@linkcode Transaction} collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total transaction.
 * @typedef {Object} TransactionDoc
 * @property {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Transaction` model via {@linkcode create()}.
 * @property {string} msg any related comments, complaints, review, message etc for this transaction
 * @property {string} e {@linkcode Types.ObjectId} as a string representing the employee that approved (is responsible for) this transaction
 * @property {string} l {@linkcode Types.ObjectId} as a string representing the location from which this product will be shipped.
 * @property {string} oid {@linkcode Types.ObjectId} as a string representing the order to which this transaction is responding to.
 * @property {string[]} amounts {@linkcode Types.ObjectId} as a string representing additional transaction-wide deductions, promos.
 */
/**
 * Adds the given transaction to the {@linkcode Transaction} collection.
 * @param {TransactionDoc | TransactionDoc[]} p the value to be added to the collection.
 * @returns {Promise<TransactionRef | TransactionRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    const Transaction = create(p.connection);
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

    p.connection.close();

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
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Transaction` model via {@linkcode create()}.
 * @param {Record<string, any> | Record<string, any>[]} p.query the mongoose query (predicate) whereby a singular {@linkcode Transaction}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * transaction model.
 * @returns {Promise<import("../models/transaction.cjs").TransactionSchemaConfig | import("../models/transaction.cjs").TransactionSchemaConfig[]>}
 * an object with the transaction id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    const Transaction = create(p.connection);
    if(Array.isArray(p.query)) return await bulkRet(p.query);
    const r = await Transaction.findOne(p.query)
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
    p.connection.close();
    return r;
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
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Transaction` model via {@linkcode create()}.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} p.id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async p => {
    const Transaction = create(p.connection);
	if (Array.isArray(p.id)) return await remBulk(p.id);
	const r = await Transaction.findByIdAndDelete(p.id).exec();
    p.connection.close();
    return r;
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
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Transaction` model via {@linkcode create()}.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, TransactionSchemaConfig> & TransactionSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/transaction.cjs").TransactionSchemaConfig>>} an object with the transaction id
 */
const mod = async p => {
    const Transaction = create(p.connection);
    const r = await Transaction.findByIdAndUpdate(p.id, p.query);
    p.connection.close();
    return r;
};

module.exports = {
    add, mod, rem, ret
}
