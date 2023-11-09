const { Types } = require("mongoose");
const { create } = require("../models/order.cjs");
/**
 * An object containing reference(s) to composite types stored against a order in the {@linkcode Order} collection.
 * @typedef {Object} OrderRef
 * @property {Types.ObjectId} order a reference to the order itself within the {@linkcode Order} collection.
 * @property {Types.ObjectId} subject the reference to the subject that sent this order. This is the id of that subject within the {@linkcode Subject} collection.
 * @property {Types.Buffer} products references to the products that were ordered for.
 */
/**
 * An object whose properties map to the {@linkcode Order} model, as such, is used to instantiate the model, which is stored in
 * an `Order` collection afterwards.
 * @typedef {Object} OrderDoc
 * @property {import("mongoose").Connection} connection The accompanying connection to the mongodb. This allows access to
 * the `Order` model via {@linkcode create()}.
 * @property {string} comments any relevant comments for this order.
 * @property {string | number} dd a valid {@linkcode Date} string (or timestamp) representing the delivery date/time.
 * @property {string[]} items product ids as strings, representing the products that is being ordered.
 * @property {"adjustment" | "assembly" | "count" | "cycle-count" | "consumption" | "kitting" | "purchase" | "replenishment" | "reserve" | "return" | "sale" | "transfer"} type the type of order.
 * @property {string} subject the id of the subject initiating this order.
 */
/**
 * Adds the given order to the {@linkcode Order} collection.
 * @param {OrderDoc | OrderDoc[]} p the value to be added to the collection.
 * @returns {Promise<OrderRef | OrderRef[]>} a promise of references to the saved data.
 */
const add = async p => {
	if (Array.isArray(p)) return await bulkAdd(p);

	const _ = {};

	const Order = create(p.connection);

	_.subject = new Types.ObjectId(p.subject);

	_.products = p.items.map(x => Buffer.from(x, "binary"));

	_.order = (
		await new Order({
			_id: new Types.ObjectId(),
			_c: p.comments,
			_d: new Date(p.dd),
			_it: _.products,
			_ot: p.type,
			_s: _.subject,
			_st: "pending"
		}).save()
	)._id;

	p.connection.close()

	return _;
};
/**
 * Adds the given orders to the {@linkcode Order} collection.
 * @param {OrderDoc[]} p the values to be added to the collection.
 * @returns {Promise<OrderRef[]>} a promise of references to the saved data.
 */
const bulkAdd = async p => {
	const docs = [];
	for (const s of p) {
		try {
			docs.push(await add(s));
		} catch (e) {}
	}
	return docs;
};
/**
 * Retrieves this order's details from a given session (memory) or from the {@linkcode Order} collection.
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Order` model via {@linkcode create()}.
 * @param {Record<string, any> | Record<string, any>[]} p.query the mongoose query (predicate) whereby a singular {@linkcode Order}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * order model.
 * @returns {Promise<import("../models/order.cjs").OrderSchemaConfig | import("../models/order.cjs").OrderSchemaConfig[]>}
 * an object with the order id. Will be an array if the second argument is an array.
 */
const ret = async p => {
	const Order = create(p.connection);
	if (Array.isArray(p.query)) return await bulkRet(p.query);
	const r = await Order.findOne(p.query).select("-_id -_cAt -_uAt -_vk").exec();
	p.connection.close();
	return r;
};
/**
 * Retrieves the details of the given order using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/order.cjs").OrderSchemaConfig[]>} An array of order data for every sucessful query.
 */
const bulkRet = async p => {
	const docs = [];
	for (const s of p) {
		try {
			docs.push(await ret(s));
		} catch (e) {}
	}
	return docs;
};

/**
 * Deletes this order from a given session (memory) or from the {@linkcode Order} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Order} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Order` model via {@linkcode create()}.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} p.id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async p => {
	const Order = create(p.connection);
	if (Array.isArray(p.id)) return await remBulk(p.id);
	const r = await Order.findByIdAndDelete(p.id).exec();
	p.connection.close();
	return r;
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Order} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Order} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this order's details i.e updates an order.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p.id the id of order to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/order.cjs").OrderSchemaConfig>} p.query the query to be run
 * which will actually modify the order. This is the modification query.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Order` model via {@linkcode create()}.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, OrderSchemaConfig> & OrderSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/order.cjs").OrderSchemaConfig>>} an object with the order id
 */
const mod = async p => {
	const Order = create(p.connection);
	const r = await Order.findByIdAndUpdate(p.id, p.query);
	p.connection.close();
	return r;
};

module.exports = {
	add,
	mod,
	rem,
	ret
};
