
const { Amount } = require("../models/amount.cjs");
const { Product } = require("../models/product.cjs");
const { Types } = require("mongoose");
const { Subject } = require("../models/subject.cjs");
/**
 * A reference to a created {@linkcode Product} model.
 * @typedef {Object} ProductRef
 * @property {import("mongoose").Schema.Types.ObjectId} product a reference to a {@linkcode Product} model.
 * @property {import("mongoose").Schema.Types.ObjectId} supplier a reference to a {@linkcode Supplier} model.
 * @property {import("mongoose").Schema.Types.ObjectId} price a reference to an {@linkcode Amount} model.
 */
/**
 * @typedef {Object} ProductDoc
 * @property {string} name the name of this product. Must be unique.
 * @property {string} category the category of this product
 * @property {string} description the description of this product
 * @property {string[]} logos the logos of this product
 * @property {Object} price the price data of this product
 * @property {number} price.amount the numerical price of this product
 * @property {string} price.iso the ISO code for the currency that the price of this product is quoted in
 * @property {string} price.comment the numerical price of this product
 * @property {string} manufacturer the name of the manufacturer of this product
 * @property {Date} manDate the date which this product was manufactured
 * @property {Date} expDate the date which this product will expire
 * @property {number} quantity the quantity of this product
 * @property {number} rop the reorder point of this product i.e when quantity levels drop to this number and below, a restock
 * alert will be sent to product responsible for restocking.
 * @property {Buffer} barcode the id of this product. Must be unique.
 * @property {string} supplier the id of the supplier of this product. Must already exist in the subject collection.
 */
/**
 * Initial indexing for the product 
 * @param {ProductDoc | ProductDoc[]} p the product to be registered
 * @returns {Promise<ProductRef> | Promise<ProductRef[]>} a reference if the save was successful.
 */
const add = async (p) => {
    if(Array.isArray(p)) return await bulkAdd(p);
    const _ = {};
    _.price = (
        await new Amount({
            _cc: p.price.iso,
            _ct: p.price.comment,
            _id: new Types.ObjectId(),
            _t: "add",
            _v: p.price.amount
        }).save()
    )._id;
    _.supplier = new Types.ObjectId(p.supplier);

    if (!(await Subject.findById(_.supplier)._id)){
        throw Error("Cannot save product because of invalid supplier id");
    }

    _.product = (
        await new Product({
            _c: p.category,
            _code: p.barcode,
            _desc: p.description,
            _exp: p.expDate,
            _id: new Types.ObjectId(),
            _l: p.logos,
            _m: p.manufacturer,
            _man: p.manDate,
            _n: p.name,
            _pr: [_.price],
            _q: p.quantity,
            _rop: p.rop,
            _sp: _.supplier
        }).save()
    )._id;
    return _;
}
/**
 * A bulk add of products.
 * @param {ProductDoc[]} p an array of products to save to the database.
 * @returns {Promise<ProductRef>} a reference of all the saves that were successful.
 */
const bulkAdd = async p => {
    const docs = [];
    for (const x of p) {
        try {
            docs.push(await add(x));
        } catch (e) {
        }
    }
    return docs;
}
/**
 * Retrieves this product's details from a given session (memory) or from the {@linkcode Product} collection.
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Product}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * product model.
 * @returns {Promise<import("../models/product.cjs").ProductSchemaConfig | import("../models/product.cjs").ProductSchemaConfig[]>}
 * an object with the product id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    if(Array.isArray(p)) return await bulkRet(p);
    return await Product.findOne(p)
    .populate({
        path: "_sp",
        model: "Subject",
    }).pupulate({
        path: "_pr",
        model: "Amount"
    })
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
}
/**
 * Retrieves the details of the given product using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/product.cjs").ProductSchemaConfig[]>} An array of product data for every sucessful query.
 */
const bulkRet = async p => {
    const docs = [];
    for(const o of p){
        try {
            docs.push(await ret(o));
        } catch (e) {
        }
    }
    return docs;
}

/**
 * Modifies this product's details i.e updates an product.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of product to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/product.cjs").ProductSchemaConfig>} p.query the query to be run
 * which will actually modify the product. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, ProductSchemaConfig> & ProductSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/product.cjs").ProductSchemaConfig>>} an object with the product id
 */
const mod = async p => {
    return await Product.findByIdAndUpdate(p.id, p.query);
}

/**
 * Deletes this product from a given session (memory) or from the {@linkcode Product} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Product} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Product.findByIdAndDelete(id).exec();
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Product} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Product} collection and not on the session. If it meant to be done on the session, then this
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

module.exports = {
    add, ret, rem, mod
}