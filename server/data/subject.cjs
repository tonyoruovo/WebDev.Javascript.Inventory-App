
const { Types } = require("mongoose");
const { Subject } = require("../models/subject.cjs");
/**
 * An object containing reference to composite types stored against a subject in the {@linkcode Subject} collection.
 * @typedef {Object} SubjectRef
 * @property {Types.ObjectId} subject a reference to the subject in the {@linkcode Subject} collection.
 * @property {Types.ObjectId} contact a reference to the contact in the `Contact` collection.
 * @property {Types.ObjectId[]} paymentTerms an array of references to the paymentTerm in the `PaymentTerm` collection.
 */
/**
 * An object whose properties map to the {@linkcode Subject} model, as such, is used to instantiate the model, which is stored in
 * a `Subject` collection afterwards.
 * @typedef {Object} SubjectDoc
 * @property {string[]} paymentTerms an array of {@linkcode Types.ObjectId} objects as a string representing the payment term of this subject.
 * @property {string} contact {@linkcode Types.ObjectId} as a string representing the id of the contact
 * @property {"male" | "m" | "female" | "f"} gender the gender of this subject
 * @property {"male" | "m" | "female" | "f"} g alias for {@linkcode SubjectDoc.gender}
 * @property {string | number} dob the date of birth of this subject.
 */
/**
 * Adds the given subject to the {@linkcode Subject} collection.
 * @param {SubjectDoc | SubjectDoc[]} p the value to be added to the collection.
 * @returns {Promise<SubjectRef | SubjectRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};

    _.contact = new Types.ObjectId(p.contact);
    _.paymentTerms = p.paymentTerms.map(x => new Types.ObjectId(x));

    _.subject = (await new Subject({
        _c: _.contact,
        _id: new Types.ObjectId(),
        _pt: _.paymentTerms,
        _dob: new Date(p.dob),
        _g: p.gender || p.g,
    }).save())._id;

    return _;
}
/**
 * Adds the given subjects to the {@linkcode Subject} collection.
 * @param {SubjectDoc[]} p the values to be added to the collection.
 * @returns {Promise<SubjectRef[]>} a promise of references to the saved data.
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
 * Retrieves this subject's details from a given session (memory) or from the {@linkcode Subject} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Subject}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * subject model.
 * @returns {Promise<import("../models/subject.cjs").SubjectSchemaConfig | import("../models/subject.cjs").SubjectSchemaConfig[]>}
 * an object with the subject id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    if(Array.isArray(p)) return await bulkRet(p);
    return await Subject.findOne(p)
    .populate({
        path: "_c",
        model: "Contact",
    })
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
}
/**
 * Retrieves the details of the given subject using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/subject.cjs").SubjectSchemaConfig[]>} An array of subject data for every sucessful query.
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
 * Deletes this subject from a given session (memory) or from the {@linkcode Subject} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Subject} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Subject.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Subject} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Subject} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this subject's details i.e updates an subject.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of subject to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/subject.cjs").SubjectSchemaConfig>} p.query the query to be run
 * which will actually modify the subject. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, SubjectSchemaConfig> & SubjectSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/subject.cjs").SubjectSchemaConfig>>} an object with the subject id
 */
const mod = async p => {
    return await Subject.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
    add, mod, rem, ret
}
