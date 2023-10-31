
const { Types } = require("mongoose");
const { Account } = require("../models/account.cjs");
/**
 * @typedef {Object} AccountRef
 * @property {Types.ObjectId} account
 */
/**
 * An object whose properties map to the {@linkcode Account} model, as such, is used to instantiate the model, which is stored in
 * an `Account` collection afterwards.
 * @typedef {Object} AccountDoc
 * @property {string} username the username of this account. The range is [3, 24].
 * @property {string} [unhashed] the unhashed password of this account. For internal accounts, this is required.
 * @property {string} [p] the external provider such as facebook, google, twitter. For external accounts, this is required.
 * @property {string} [pid] the external provider. For external accounts, this is required.
 * @property {string} [at] the provider access token. For external accounts, this is required.
 * @property {string} [rt] the provider refresh token (oauth).
 * @property {string} [ats] the provider access token secret (twitter).
 */
/**
 * Adds the given account to the {@linkcode Account} collection.
 * @param {AccountDoc | AccountDoc[]} p the value to be added to the collection.
 * @returns {Promise<AccountRef | AccountRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};

    _.account = (await new Account({
        _at: p.at,
        _ats: p.ats,
        _h: p.unhashed,
        _id: new Types.ObjectId(),
        _p: p.p,
        _pid: p.pid,
        _rt: p.rt,
        _u: p.username
    }).save())._id;

    return _;
}
/**
 * Adds the given accounts to the {@linkcode Account} collection.
 * @param {AccountDoc[]} p the values to be added to the collection.
 * @returns {Promise<AccountRef[]>} a promise of references to the saved data.
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
 * Retrieves this account's details from a given session (memory) or from the {@linkcode Account} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Account}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * account model.
 * @returns {Promise<import("../models/account.cjs").AccountSchemaConfig | import("../models/account.cjs").AccountSchemaConfig[]>}
 * an object with the account id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    if(Array.isArray(p)) return await bulkRet(p);
    return await Account.findOne(p)
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
}
/**
 * Retrieves the details of the given account using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/account.cjs").AccountSchemaConfig[]>} An array of account data for every sucessful query.
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
 * Deletes this account from a given session (memory) or from the {@linkcode Account} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Account} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Account.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Account} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Account} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this account's details i.e updates an account.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of account to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/account.cjs").AccountSchemaConfig>} p.query the query to be run
 * which will actually modify the account. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, AccountSchemaConfig> & AccountSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/account.cjs").AccountSchemaConfig>>} an object with the account id
 */
const mod = async p => {
    return await Account.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
    add, mod, rem, ret
}
