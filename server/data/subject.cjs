
const { Types } = require("mongoose");
const { Subject } = require("../models/subject.cjs");
const { Contact } = require("../models/contact.cjs");
const { PaymentTerm } = require("../models/paymentTerm.cjs");
const { Amount } = require("../models/amount.cjs");
const { Address } = require("../models/address.cjs");
const { Email } = require("../models/email.cjs");
const { PersonName } = require("../models/name.cjs");
const { Phone } = require("../models/phone.cjs");
/**
 * An object containing reference to composite types stored against a subject in the {@linkcode Subject} collection.
 * @typedef {Object} SubjectRef
 * @property {Types.ObjectId} contact a reference to the contact in the {@linkcode Contact} collection.
 * @property {Types.ObjectId} subject a reference to the subject in the `Subject` collection.
 * @property {Types.ObjectId[]} paymentTerms an array of references to the paymentTerm in the {@linkcode PaymentTerm} collection.
 */
/**
 * An object representing a figure of currency to be added, subtracted, multiplied, divided etc to the sum total amount.
 * @typedef {Object} AmountDoc
 * @property {string} [iso="566"] the 3-letter ISO code for the currency being used for this transaction. The default is the code
 * `"566"` which is the currency code for the Nigerian Naira.
 * @property {"a" | "add" | "subtract" | "s" | "multiply" | "m" | "divide" | "d" | "sqrt" | "cbrt" | "exp" | "percent" | "log"} [type="add"]
 * The type of relation this will have to the total (base) amount. FOr example, if this value is `"add"`, then the {@linkcode AmountDoc.value}
 * property will be added to base amount.
 * @property {number} value the numerical representation of this amount.
 * @property {Date} [expiresAt] for time-sensitive bills, promos and deductables. Specifies the time stamp for the expiration of
 * this amount.
 * @property {string} [comments] any relevant info that should be included.
 * @property {string} [comment] an alias for {@linkcode AmountDoc.comments}.
 */
/**
 * An Object whose properties map to the {@linkcode PaymentTerm} model, as such, is used to instantiate the model, which is added
 * to an array of the {@linkcode Subject}.
 * @typedef {Object} PaymentTermDoc
 * @property {string} t_c the terms and conditions regarding this payment term. This is required.
 * @property {number} [period] a number relating to the duration of the payment. If this value is `4` and {@linkcode PaymentTermDoc.interval}
 * is `'day'`, then payment is expected the amount given will be split into 4 days. This is required only if this term is a partial
 * payment plan and `interval` is set.
 * @property {"second" | "minute" | "hour" | "day" | "week" | "month" | "year" | "decade"} [interval="day"] the unit of time being used for partial
 * payments.
 * @property {AmountDoc[]} amounts all deductions, reductions, prices, taxes, bills, charges, promos etc.
 * @property {"cheque" | "check" | "cash" | "wire" | "credit" | "etf"} paymentType the payment method. the `"etf"` option stands for
 * *E*lectronic *T*ransfer *F*unds these include (paypal, verve, interswitch, crypto etc).
 * @property {string[]} codes important codes and numbers related to this payment term, for example account numbers, transfer
 * tokens, wallet ids etc. The alias is `paymentCodes`.
 */
/**
 * An representation of a document that will be mapped to the {@linkcode Address} model, then stored in an {@linkcode Address}
 * collection.
 * @typedef {Object} AddressDoc
 * @property {string} street the street of the subject
 * @property {string} [landmark] any landmark useful in identifying the street of the subject
 * @property {string} city the city where the street of the subject resides.
 * @property {string} zip the zip code of the city where the street of the subject resides.
 * @property {string} lga the local government area of the city where the street of the subject resides.
 * @property {string} state the state or region where the city of the subject resides.
 * @property {string} [countryCode="234"] the country code where the subject resides.
 * @property {string} [comments] any neccessary comments.
 */
/**
 * An representation of a document that will be mapped to the {@linkcode Phone} model, then stored in an {@linkcode Phone}
 * collection.
 * @typedef {Object} PhoneDoc
 * @property {string} number the digits of the localised part of the international number. For example, in `"+2347059120071"` this
 * value will be `"7059120071"` with a `0` prepended to it. Please do not include any thing that is not a number as this value will
 * be checked against the regex `/^\d\d{7,12}$/`.
 * @property {"mobile" | "home" | "work" | "fax" | "emergency" | "main" | "alt" | "sec" | "direct" | "customer-support" | "sales" | "billing" | "technical-support" | "vendor" | "supplier" | "personal" | "other"} type
 * The type of phone number this is.
 * @property {number} [preference=0] an enum representing the weight of this phone number.
 * @property {string} [code="234"] the 3-letter ISO country code for the country of this phone number.
 */
/**
 * An Object whose properties map to the {@linkcode Contact} model, as such, is used to instantiate the model, which is stored in
 * a `Contact` collection afterwards.
 * @typedef {Object} ContactDoc
 * @property {AddressDoc[]} addresses the addresses of this contact
 * @property {PhoneDoc[]} phones the phone numbers of this contact
 * @property {string[]} [emails] the emails of this contact
 * @property {string[]} websites an array of website urls of this client.
 * @property {string[]} socials an array of social media urls of this client.
 * @property {Object} fullname the name(s) of this contact.
 * @property {string} fullname.name the first name.
 * @property {string} fullname.surname the last name.
 * @property {string[]} [fullname.others] any other names be included such as middlenames, nicknames etc.
 * @property {string[]} [fullname.preTitles] the titles to be prepended to the full name.
 * @property {string[]} [fullname.postTitles] the titles to be appended to the full name.
 * @property {string} [companyName] the name of the company that this contact is representing. Required if this is the
 * contact of a supplier.
 * @property {string} [comments] any relevant comment(s), complaint(s) or request(s).
 * @property {"call" | "sms" | "email" | "social" | "other"} pm preferred contact method.
 * @property {string[]} [photos] buffer (8-byte(s) data) strings that is the photo of this contact. each index is a photo.
 */
/**
 * An object whose properties map to the {@linkcode Subject} model, as such, is used to instantiate the model, which is stored in
 * a `Subject` collection afterwards.
 * @typedef {Object} SubjectDoc
 * @property {PaymentTermDoc[]} paymentTerms the payment term of this subject.
 * @property {ContactDoc} contact
 */
/**
 * Adds the given subject to the {@linkcode Subject} collection.
 * @param {SubjectDoc | SubjectDoc[]} p the value to be added to the collection.
 * @returns {Promise<SubjectRef | SubjectRef[]>} a promise of references to the saved data.
 */
const add = async p => {
    if(Array.isArray(p)) return await bulkAdd(p);

    const _ = {};
    _.paymentTerm = [];
    for (const pt of p.paymentTerms) {
        const as = [];
        for (const a of pt.amounts) {
            as.push(new Amount({
                _cc: a.iso || "566",
                _ct: a.comments || a.comment,
                _expiresAt: a.expiresAt,
                _id: new Types.ObjectId(),
                _t: a.type || "add",
                _v: a.value
            }));
        }
        _.paymentTerm.push((await new PaymentTerm({
            _id: new Types.ObjectId(),
            _a: as,
            _ic: pt.codes,
            _it: pt.interval,
            _prd: pt.period,
            _tc: pt.t_c,
            _ty: pt.paymentType
        }).save())._id);
    }

    const ads = [];
    for(const ad of p.contact.addresses) {
        ads.push(new Address({
            _c: ad.city,
            _cc: ad.countryCode || "234",
            _com: ad.comments,
            _id: new Types.ObjectId(),
            _l: ad.landmark,
            _lg: ad.lga,
            _s: ad.street,
            _st: ad.state,
            _z: ad.zip
        }));
    }
    _.contact = (await new Contact({
        _a: ads,
        _com_n: p.contact.companyName,
        _e: p.contact.emails.map(e => new Email({
            _id: new Types.ObjectId(),
            _e: e
        })),
        _id: new Types.ObjectId(),
        _n: (await PersonName({
            _id: new Types.ObjectId(),
            _n: p.contact.fullname,
        }).save())._id(),
        _nt: p.contact.comments,
        _p: p.contact.phones.map(ph => new Phone({
            _c: ph.code,
            _id: new Types.ObjectId(),
            _n: ph.number,
            _pf: ph.preference,
            _t: ph.type
        })),
        _pm: p.contact.pm,
        _pp: p.contact.photos,
        _s: p.contact.socials,
        _w: p.contact.websites
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
