const { Types } = require("mongoose");
const { Contact } = require("../models/contact.cjs");
const { v } = require("../repo/utility.cjs");

/**
 * An object containing reference(s) to composite types stored against an contact in the {@linkcode Contact} collection.
 * @typedef {Object} ContactRef
 * @property {Types.ObjectId} contact a reference to the contact itself within the {@linkcode Contact} collection.
 * @property {Types.ObjectId[]} addresses references to addresses within the `Address` collection.
 * @property {Types.ObjectId[]} phones references to phones within the `Phone` collection.
 * @property {Types.ObjectId} account a reference to the account within the `Account` collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total contact.
 * @typedef {Object} ContactDoc
 * @property {string} [cn] alias for {@linkcode ContactDoc.companyName}
 * @property {string} [companyName] the name of the company that own this contact
 * @property {string} [msg] any relevant messsage for this contact
 * @property {string} [n] alias for {@linkcode ContactDoc.name}
 * @property {string} [name] {@linkcode Types.ObjectId} as a string representing the fullname of the owner of this contact.
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

	_.contact = (
		await new Contact({
			_id: new Types.ObjectId(),
			_com_n: p.cn || p.companyName,
			_n: p.n || p.name,
			_a: _.addresses,
            _ac: _.account,
            _nt: p.msg,
            _p: _.phones,
            _pm: p.pm || p.preferredMethod,
            _pp: v(p.pp || p.profilePicture) ? [(p.pp || p.profilePicture)] : ((p.pps || p.profilePictures)),
            _s: v(p.s || p.social) ? [(p.s || p.social)] : ((p.ss || p.socials)),
            _w: v(p.w || p.website) ? [(p.w || p.website)] : ((p.ws || p.websites)),
		}).save()
	)._id;

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
 * @param {Record<string, any> | Record<string, any>[]} p the mongoose query (predicate) whereby a singular {@linkcode Contact}
 * document will be retrieved. If this is an array, then a each index is assumed to contain the predicate for a single
 * contact model.
 * @returns {Promise<import("../models/contact.cjs").ContactSchemaConfig | import("../models/contact.cjs").ContactSchemaConfig[]>}
 * an object with the contact id. Will be an array if the second argument is an array.
 */
const ret = async p => {
	if (Array.isArray(p)) return await bulkRet(p);
	return await Contact.findOne(p).select("-_id -_cAt -_uAt -_vk").exec();
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
 * @param {import("mongoose").Schema.Types.ObjectId | import("mongoose").Schema.Types.ObjectId[]} id the object id of the value to be deleted. Can be an array for
 * multiple values.
 * @returns {Promise<any | any[]>} any value
 */
const rem = async id => {
	if (Array.isArray(id)) return await remBulk(id);
	return await Contact.findByIdAndDelete(id).exec();
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
 * @param {import("mongoose").Schema.Types.ObjectId} p._id the id of contact to be modified
 * @param {import("mongoose").UpdateQuery<import("../models/contact.cjs").ContactSchemaConfig>} p.query the query to be run
 * which will actually modify the contact. This is the modification query.
 * @returns {Promise<import("mongoose").Query<Document<unknown, any, ContactSchemaConfig> & ContactSchemaConfig & Required<{_id: import("mongoose").Schema.Types.ObjectId}>, import("../models/contact.cjs").ContactSchemaConfig>>} an object with the contact id
 */
const mod = async p => {
	return await Contact.findByIdAndUpdate(p.id, p.query);
};

module.exports = {
	add,
	mod,
	rem,
	ret
};
