
const { Types } = require("mongoose");
const { Address } = require("../models/address.cjs");

/**
 * An object containing reference(s) to composite types stored against an address in the {@linkcode Address} collection.
 * @typedef {Object} AddressRef
 * @property {Types.ObjectId} address a reference to the address itself within the {@linkcode Address} collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total address.
 * @typedef {Object} AddressDoc
 * @property {string} [msg] any related comments, complaints, review, message etc for this address
 * @property {string} s alias for {@linkcode AddressDoc.street}
 * @property {string} street the street name and number
 * @property {string} [l] alias for {@linkcode AddressDoc.landmark}
 * @property {string} [landmark] any known landmark that aids in the locating the given street.
 * @property {string} [c] alias for {@linkcode AddressDoc.city}
 * @property {string} [city] the city in which the given street is located.
 * @property {string} [z] alias for {@linkcode AddressDoc.zip}
 * @property {string} [zip] the zip code of the given street.
 * @property {string} [lg] alias for {@linkcode AddressDoc.lga}
 * @property {string} [lga] the local government area in which the given street is located.
 * @property {string} [st] alias for {@linkcode AddressDoc.state}
 * @property {string} [state] the state in which the given street is located.
 * @property {string} [cc] alias for {@linkcode AddressDoc.cCode}
 * @property {string} [cCode] the 3-letter iso country code of the country in which the given street is located.
 */
/**
 * Adds the given address to the {@linkcode Address} collection.
 * @param {AddressDoc | AddressDoc[]} p the value to be added to the collection.
 * @returns {Promise<AddressRef | AddressRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};

    _.address = ((await new Address({
        _id: new Types.ObjectId(),
        _s: p.s || p.street,
        _l: p.l || p.landmark,
        _c: p.c || p.city,
        _z: p.z || p.zip,
        _lg: p.lg || p.lga,
        _com: p.msg,
        _st: p.st || p.state,
        _cc: p.cc || p.cCode
    }).save())._id);

    return _;
}
/**
 * Adds the given addresss to the {@linkcode Address} collection.
 * @param {AddressDoc[]} p the values to be added to the collection.
 * @returns {Promise<AddressRef[]>} a promise of references to the saved data.
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
 * Retrieves this address's details from a given session (memory) or from the {@linkcode Address} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Address}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * address model.
 * @returns {Promise<import("../models/address.cjs").AddressSchemaConfig | import("../models/address.cjs").AddressSchemaConfig[]>}
 * an object with the address id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    if(Array.isArray(p)) return await bulkRet(p);
    return await Address.findOne(p)
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
}
/**
 * Retrieves the details of the given address using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/address.cjs").AddressSchemaConfig[]>} An array of address data for every sucessful query.
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
 * Deletes this address from a given session (memory) or from the {@linkcode Address} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Address} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Address.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Address} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Address} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this address's details i.e updates an address.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of address to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/address.cjs").AddressSchemaConfig>} p.query the query to be run
 * which will actually modify the address. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, AddressSchemaConfig> & AddressSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/address.cjs").AddressSchemaConfig>>} an object with the address id
 */
const mod = async p => {
    return await Address.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
    add, mod, rem, ret
}
