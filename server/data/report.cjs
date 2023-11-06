
const { Types } = require("mongoose");
const { create } = require("../models/report.cjs");

/**
 * An object containing reference(s) to composite types stored against an report in the {@linkcode Report} collection.
 * @typedef {Object} ReportRef
 * @property {Types.ObjectId} report a reference to the report itself within the {@linkcode Report} collection.
 */
/**
 * Note that there may be other parameters attached to this object, but the properties specified.
 * @typedef {Object} ReportParam The location of the subject of this report as well as any relevant parameters.
 * here are essential.
 * @property {string} modelName The name of the model directly related to this report.
 * @property {string[]} path path to any specific property within the related model. Each element represents a nesting level in the path
 * therefore, the dot `'.'` character is not allowed within each string
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total report.
 * @typedef {Object} ReportDoc
 * @property {import("mongoose").Connection} connection The accompanying connection to the mongodb. This allows access to
 * the `Report` model via {@linkcode create()}.
 * @property {string} msg The body of this report
 * @property {ReportParam[]} params The parameters and filters of this report
 * @property {"inventory-status" | "sales" | "purchases" | "financial" | "inventory-valuation" | "stock-reorder" | "product-movement" | "custom"} type The type of report being submitted.
 */
/**
 * Adds the given report to the {@linkcode Report} collection.
 * @param {ReportDoc | ReportDoc[]} p the value to be added to the collection.
 * @returns {Promise<ReportRef | ReportRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};

    const Report = create(p.connection);

    _.report = ((await new Report({
        _id: new Types.ObjectId(),
        _m: p.msg,
        _pf: p.params,
        _t: p.type
    }).save())._id);

    return _;
}
/**
 * Adds the given reports to the {@linkcode Report} collection.
 * @param {ReportDoc[]} p the values to be added to the collection.
 * @returns {Promise<ReportRef[]>} a promise of references to the saved data.
 */
const bulkAdd = async p => {
    const docs = [];
    for (const s of p) {
        try {
            docs.push(await add(s));
        } catch (e) {
        }
    }
    return docs;
}
/**
 * Retrieves this report's details from a given session (memory) or from the {@linkcode Report} collection.
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Report` model via {@linkcode create()}.
 * @param {Record<string, any> | Record<string, any>[]} p.query the mongoose query (predicate) whereby a singular {@linkcode Report}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * report model.
 * @returns {Promise<import("../models/report.cjs").ReportSchemaConfig | import("../models/report.cjs").ReportSchemaConfig[]>}
 * an object with the report id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    const Report = create(p.connection);
    if(Array.isArray(p.query)) return await bulkRet(p.query);
    return await Report.findOne(p.query)
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
}
/**
 * Retrieves the details of the given report using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/report.cjs").ReportSchemaConfig[]>} An array of report data for every sucessful query.
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
 * Deletes this report from a given session (memory) or from the {@linkcode Report} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Report} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Report` model via {@linkcode create()}.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} p.id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async p => {
    const Report = create(p.connection);
	if (Array.isArray(p.id)) return await remBulk(p.id);
	return await Report.findByIdAndDelete(p.id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Report} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Report} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this report's details i.e updates an report.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p.id the id of report to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/report.cjs").ReportSchemaConfig>} p.query the query to be run
 * which will actually modify the report. This is the modification query.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Report` model via {@linkcode create()}.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, ReportSchemaConfig> & ReportSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/report.cjs").ReportSchemaConfig>>} an object with the report id
 */
const mod = async p => {
    const Report = create(p.connection);
    return await Report.findByIdAndUpdate(p.id, p.query);
};
/**
 * @typedef {Object} SalesReportParam Paramaters for generating a report
 * @property {Date} from the start date for the report
 * @property {Date} to the end date for the report
 * @property {ReportDoc} body the body of the report.
 * @property {import("mongoose").Connection} connection the connection that will be used to create `Transaction`, `Subject`
 * and other relevant models.
 */
/**
 * 
 * @param {SalesReportParam} p the options for generating the report
 */
// const genRep = async p => {
//     const { create } = require("../models/transaction.cjs");
//     const Transaction = create(p.connection);
// }

module.exports = {
    add, mod, rem, ret
}
