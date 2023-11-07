const { Types } = require("mongoose");
const { create } = require("../models/contact.cjs");
const { v } = require("../repo/utility.cjs");

/**
 * An object containing reference(s) to composite types stored against an contact in the {@linkcode Contact} collection.
 * @typedef {Object} ContactRef
 * @property {Types.ObjectId} contact a reference to the contact itself within the {@linkcode Contact} collection.
 * @property {Types.ObjectId[]} addresses references to addresses within the `Address` collection.
 * @property {Types.ObjectId[]} phones references to phones within the `Phone` collection.
 * @property {Types.ObjectId} account a reference to the account within the `Account` collection.
 * @property {import("../models/name.cjs").NameDoc} name the id of the name of this contact within the `Name` collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total contact.
 * @typedef {Object} ContactDoc
 * @property {import("mongoose").Connection} connection The accompanying connection to the mongodb. This allows access to
 * the `Contact` model via {@linkcode create()}.
 * @property {string} [cn] alias for {@linkcode ContactDoc.companyName}
 * @property {string} [companyName] the name of the company that own this contact
 * @property {string} [msg] any relevant messsage for this contact
 * @property {import("../models/name.cjs").NameDoc} [n] alias for {@linkcode ContactDoc.name}
 * @property {import("../models/name.cjs").NameDoc} [name] the name representing the fullname of the owner of this contact.
 * @property {string} [a] alias for {@linkcode ContactDoc.address}
 * @property {string} [address] {@linkcode Types.ObjectId} as a string representing the address of this contact.
 * @property {string[]} [as] alias for {@linkcode ContactDoc.address}
 * @property {string[]} [addresses] an array of {@linkcode Types.ObjectId} objects as strings representing the addresses of this contact.
 * @property {string} [ac] alias for {@linkcode ContactDoc.account}
 * @property {string} [account] {@linkcode Types.ObjectId} as a string representing the account of this contact.
 * @property {string} [p] alias for {@linkcode ContactDoc.phone}
 * @property {string} [phone] {@linkcode Types.ObjectId} as a string representing the phone of this contact.
 * @property {string[]} [ps] alias for {@linkcode ContactDoc.phones}
 * @property {string[]} [phones] an array of {@linkcode Types.ObjectId} as a strings representing the phone of this contact.
 * @property {"call" | "sms" | "email" | "social" | "other"} [pm] alias for {@linkcode ContactDoc.preferredMethod}
 * @property {"call" | "sms" | "email" | "social" | "other"} [preferredMethod] the preferred contact method for this contact.
 * @property {string[]} [pps] alias for {@linkcode ContactDoc.profilePictures}.
 * @property {string[]} [profilePictures] the photos to use for profile pictures on both light and dark modes.
 * @property {string} [pp] alias for {@linkcode ContactDoc.profilePicture}.
 * @property {string} [profilePicture] the photo to use for profile picture.
 * @property {string[]} [ss] alias for {@linkcode ContactDoc.socials}.
 * @property {string[]} [socials] urls to social media accounts.
 * @property {string} [s] alias for {@linkcode ContactDoc.social}.
 * @property {string} [social] social media for this contact.
 * @property {string[]} [ws] alias for {@linkcode ContactDoc.websites}.
 * @property {string[]} [websites] urls to website owned by this contact.
 * @property {string} [w] alias for {@linkcode ContactDoc.website}.
 * @property {string} [website] website for this contact.
 */
/**
 * Adds the given contact to the {@linkcode Contact} collection.
 * @param {ContactDoc | ContactDoc[]} p the value to be added to the collection.
 * @returns {Promise<ContactRef | ContactRef[]>} a promise of references to the saved data.
 */
const add = async p => {
	if (Array.isArray(p)) return await bulkAdd(p);

	const _ = {};

	_.addresses = v(p.a || p.address)
		? [new Types.ObjectId(p.a || p.address)]
		: (p.as || p.addresses).map(x => new Types.ObjectId(x));

	_.phones = v(p.p || p.phone)
		? [new Types.ObjectId(p.p || p.phone)]
		: (p.ps || p.phones).map(x => new Types.ObjectId(x));

    _.account = new Types.ObjectId(p.ac || p.account);

	const Contact = create(p.connection);
	const Name = require("../models/name.cjs").create(p.connection);

	const n = await Name.findById(p.n || p.name).exec();

	if(v(n)) _.name = n;
	else _.name = (await new Name(p.n || p.name).save())._id;

	_.contact = (
		await new Contact({
			_id: new Types.ObjectId(),
			_com_n: p.cn || p.companyName,
			_n: _.name,
			_a: _.addresses,
            _ac: _.account,
            _nt: p.msg,
            _p: _.phones,
            _pm: p.pm || p.preferredMethod || "sms",
            _pp: v(p.pp || p.profilePicture) ? [(p.pp || p.profilePicture)] : ((p.pps || p.profilePictures)),
            _s: v(p.s || p.social) ? [(p.s || p.social)] : ((p.ss || p.socials)),
            _w: v(p.w || p.website) ? [(p.w || p.website)] : ((p.ws || p.websites)),
		}).save()
	)._id;

	p.connection.close();

	return _;
};
/**
 * Adds the given contacts to the {@linkcode Contact} collection.
 * @param {ContactDoc[]} p the values to be added to the collection.
 * @returns {Promise<ContactRef[]>} a promise of references to the saved data.
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
 * Retrieves this contact's details from a given session (memory) or from the {@linkcode Contact} collection.
 * @param {Object} p the parameter object.
 * @param {Record<string, any> | Record<string, any>[]} p.query the mongoose query (predicate) whereby a singular {@linkcode Contact}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * contact model.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Contact` model via {@linkcode create()}.
 * @returns {Promise<import("../models/contact.cjs").ContactSchemaConfig | import("../models/contact.cjs").ContactSchemaConfig[]>}
 * an object with the contact id. Will be an array if the second argument is an array.
 */
const ret = async p => {
	const Contact = create(p.connection);
	if (Array.isArray(p.query)) return await bulkRet(p.query);
	const r = await Contact.findOne(p.query).select("-_id -_cAt -_uAt -_vk").exec();
	p.connection.close();
	return r;
};
/**
 * Retrieves the details of the given contact using the array of queries to execute for each of the item to get.
 * @param {Record<string, any>[]} p An array of mongoose queries which will be executed one after the other
 * @returns {Promise<import("../models/contact.cjs").ContactSchemaConfig[]>} An array of contact data for every sucessful query.
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
 * Deletes this contact from a given session (memory) or from the {@linkcode Contact} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Contact} collection and not on the session. If it meant to be done on the session, then this
 * value must be valid, else no value will be deleted.
 * @param {Object} p the parameter object.
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} p.id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Contact` model via {@linkcode create()}.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async p => {
	const Contact = create(p.connection)
	if (Array.isArray(p.id)) return await remBulk(p.id);
	const r = await Contact.findByIdAndDelete(p.id).exec();
	p.connection.close();
	return r;
};

/**
 * Deletes this employees from a given session (memory) or from the {@linkcode Contact} collection.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object. Should be `null` or `undefined` if the deletion is meant
 * to be done on the {@linkcode Contact} collection and not on the session. If it meant to be done on the session, then this
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
 * Modifies this contact's details i.e updates an contact.
 * @todo removed this param {import("../server.cjs").DbObject} m the session object
 * @param {Object} p the parameter options
 * @param {import("mongoose").Schema.Types.ObjectId} p.id the id of contact to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/contact.cjs").ContactSchemaConfig>} p.query the query to be run
 * which will actually modify the contact. This is the modification query.
 * @param {import("mongoose").Connection} p.connection The accompanying connection to the mongodb. This allows access to
 * the `Contact` model via {@linkcode create()}.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, ContactSchemaConfig> & ContactSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/contact.cjs").ContactSchemaConfig>>} an object with the contact id
 */
const mod = async p => {
	const Contact = create(p.connection);
	const r = await Contact.findByIdAndUpdate(p.id, p.query);
	p.connection.close();
	return r;
};

module.exports = {
	add,
	mod,
	rem,
	ret
};
