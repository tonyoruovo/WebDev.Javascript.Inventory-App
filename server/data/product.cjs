
const { create } = require("../models/product.cjs");
const { Types } = require("mongoose");
const { v } = require("../repo/utility.cjs");
// const { tmpdir } = require("os");
// const { mkdtempSync, writeFileSync, readFileSync } = require("fs");
// const { sep } = require("path");
/**
 * A reference to a created {@linkcode Product} model.
 * @typedef {Object} ProductRef
 * @property {import("mongoose").Schema.Types.ObjectId} product a reference to a {@linkcode Product} model.
 * @property {import("mongoose").Schema.Types.ObjectId} supplier a reference to a {@linkcode Supplier} model.
 * @property {import("mongoose").Schema.Types.ObjectId} price a reference to an {@linkcode Amount} model.
 */
/**
 * @typedef {Object} ProductDoc
 * @property {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Product` model via {@linkcode create()}.
 * @property {string} b alias for {@linkcode ProductDoc.barcode}
 * @property {string} barcode the barcode of this product. Must be unique.
 * @property {string} ct alias for {@linkcode ProductDoc.category}
 * @property {string} [category] the category of this product
 * @property {string[]} [categories] the categories of this product, this is a synonym of {@linkcode ProductDoc.category}.
 * @property {string[]} cts alias for {@linkcode ProductDoc.categories}
 * @property {string} [description] the description of this product. In the future, this value would be an object whose keys are the properties of the product which may include:
 * - `color`
 * - `weight`
 * - `dietary info`
 * - `ingredients`
 * - `contents`
 * - `size`
 * - `model`
 * 
 * And any other relevant info.
 * @property {string} [descr] the description of this product. A synonym of {@linkcode ProductDoc.desc}
 * @property {string | number} ed alias for {@linkcode ProductDoc.expDate}
 * @property {string | number} expDate the date which this product will expire
 * @property {string[]} logos the logos of this product
 * @property {string} m alias for {@linkcode ProductDoc.manufacturer}
 * @property {string | number} md alias for {@linkcode ProductDoc.manDate}
 * @property {string | number} manDate the date which this product was manufactured
 * @property {string} manufacturer the name of the manufacturer of this product
 * @property {string} name the name of this product. Must be unique.
 * @property {string} p alias for {@linkcode ProductDoc.price}
 * @property {string} price an {@linkcode Types.ObjectId} object as a string which represent the proce of this product.
 * @property {number} quantity the quantity of this product
 * @property {number} q alias for {@linkcode ProductDoc.quantity}
 * @property {number} rop the reorder point of this product i.e when quantity levels drop to this number and below, a restock
 * alert will be sent to product responsible for restocking.
 * @property {number} r alias for {@linkcode ProductDoc.rop}
 * @property {string} supplier the id of the supplier of this product. Must already exist in the subject collection.
 * @property {string} s alias for {@linkcode ProductDoc.supplier}
 */
/**
 * Initial indexing for the product 
 * @param {ProductDoc | ProductDoc[]} p the product to be registered
 * @returns {Promise<ProductRef> | Promise<ProductRef[]>} a reference if the save was successful.
 */
const add = async (p) => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const Product = create(p.connection);
    // const tmp = tmpdir();

    // const tempDir = mkdtempSync(`${tmp}${sep}`);

    // writeFileSync(`${tempDir}barcode`, p.barcode || p.b, {encoding: "binary"});

    // const code = readFileSync(`${tempDir}barcode`, {encoding: "binary"});
    const code = v(p.barcode || p.b) ? Buffer.from(p.barcode || p.b, "binary") : undefined;

    const _ = {};
    _.supplier = new Types.ObjectId(p.supplier || p.s);
    _.price = new Types.ObjectId(p.price || p.p);
    _.product = (await new Product({
        _id: code,
        _c: v(p.category || p.ct) ? [(p.category || p.ct), ...(p.categories || p.cts)] : (p.categories || p.cts),
        _desc: p.descr || p.description,
        _exp: new Date(p.expDate || p.ed),
        _l: p.logos,
        _m: p.m || p.manufacturer,
        _man: p.manDate || p.md,
        _n: p.name,
        _pr: _.price,
        _q: p.quantity || p.q,
        _rop: p.rop || p.r,
        _sp: _.supplier
    }).save())._id;

    p.connection.close();

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
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Product` model via {@linkcode create()}.
 * @param {Record<string, any> | Record<string, any>[]} p.query the mongoose query (predicate) whereby a singular {@linkcode Product}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * product model.
 * @returns {Promise<import("../models/product.cjs").ProductSchemaConfig | import("../models/product.cjs").ProductSchemaConfig[]>}
 * an object with the product id. Will be an array if the second argument is an array.
 */
const ret = async p => {
    const Product = create(p.connection);
    if(Array.isArray(p.query)) return await bulkRet(p.query);
    const r = await Product.findOne(p.query)
    .populate({
        path: "_sp",
        model: "Subject",
    }).pupulate({
        path: "_pr",
        model: "Amount"
    })
    .select("-_id -_cAt -_uAt -_vk")
    .exec();
    p.connection.close();
    return r;
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
 * @param {import("mongoose").Schema.Types.ObjectId} p.id the id of product to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/product.cjs").ProductSchemaConfig>} p.query the query to be run
 * which will actually modify the product. This is the modification query.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Product` model via {@linkcode create()}.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, ProductSchemaConfig> & ProductSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/product.cjs").ProductSchemaConfig>>} an object with the product id
 */
const mod = async p => {
    const Product = create(p.connection);
    const r = await Product.findByIdAndUpdate(p.id, p.query);
    p.connection.close();
    return r;
}

/**
 * Deletes this product from a given session (memory) or from the {@linkcode Product} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Product} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Product` model via {@linkcode create()}.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} p.id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async p => {
    const Product = create(p.connection);
	if (Array.isArray(p.id)) return await remBulk(p.id);
	const r = await Product.findByIdAndDelete(p.id).exec();
    p.connection.close();
    return r;
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