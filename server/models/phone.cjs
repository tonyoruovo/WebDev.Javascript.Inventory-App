
const mongoose = require("mongoose");
const { US } = require("../repos/utility.cjs");
/**
 * This type is used to indicate that the phone number is associated with a mobile device, such as a cell phone.
 * Mobile numbers are often used for personal communication and are typically associated with individuals.
 * @typedef {"mobile"} mobile
 */
/**
 * A "work" phone number type is used to identify phone numbers associated with a person's workplace or business.
 * It can be used for professional communication, such as work-related calls.
 * @typedef {"work"} work
 */
/**
 * This type represents phone numbers associated with a person's home or residential address. Home phone numbers are
 * often used for personal and family-related communication.
 * @typedef {"home"} home
 */
/**
 * Fax numbers are used exclusively for sending and receiving facsimile (fax) documents. This type is used to distinguish
 * fax numbers from regular voice communication numbers.
 * @typedef {"fax"} fax
 */
/**
 * In a business context, the "main" phone number type may refer to the primary contact number for a company or organization.
 * It is typically the main point of contact for general inquiries.
 * @typedef {"main"} main
 */
/**
 * Some phone numbers, like 911 in the United States, are dedicated to emergency services. The "emergency" type can be used
 * to identify such numbers.
 * @typedef {"emergency"} emergency
 */
/**
 * This type can be used for additional phone numbers associated with a person or organization. It may be a secondary mobile number,
 * an alternative contact number, or a backup phone number.
 * @typedef {"sec" | "alt"} sec
 */
/**
 * In a business context, a "direct line" phone number type can indicate a phone number that directly connects to a specific
 * individual or department within an organization
 * @typedef {"direct"} direct
 */
/**
 * This type can be used for phone numbers dedicated to customer support or helpdesk services, making it easier to identify
 * and route customer-related inquiries.
 * @typedef {"customer-support"} customer_support
 */
/**
 * A "sales" phone number type can be used to identify phone numbers specifically for sales inquiries and contacts within a
 * business.
 * @typedef {"sales"} sales
 */
/**
 * This type may be used for phone numbers related to billing inquiries or payment processing within a company.
 * @typedef {"billing"} billing
 */
/**
 * For technical support-related phone numbers, this type can be applied to help users easily differentiate them
 * from other contact numbers.
 * @typedef {"technical-support"} technical_support
 */
/**
 * In a business-to-business context, this type can be used for phone numbers associated with vendors or suppliers.
 * @typedef {"vendor" | "supplier"} vendor
 */
/**
 * This type can represent a personal phone number that may not fit into the "mobile" or "home" categories, such as
 * a dedicated personal business line.
 * @typedef {"personal"} personal
 */
/**
 * An "other" category can be used for phone numbers with types that don't fit into any of the predefined categories.
 * It allows for flexibility in classifying phone numbers with unique or specific uses.
 * @typedef {"other"} other
 */
/**
 * @typedef {object} PhoneRecord
 * @property {number} [code=234] the ISO country code of the given phone number
 * @property {string} number the given phone number
 * @property {mobile | home | work | fax | emergency | main | sec | direct | customer_support | sales | billing | technical_support | vendor | personal | other} [type="work"]
 * The "type" property in the "phone number" model typically represents the type or category of the phone number, indicating
 * its intended use or purpose. In a real-world context, there can be various options for the "type" property to classify phone
 * numbers based on their use. Here are some common options for the "type" property:
 * - **Mobile**: This type is used to indicate that the phone number is associated with a mobile device, such as a cell phone. Mobile numbers are often used for personal communication and are typically associated with individuals.
 * - **Work**: A "work" phone number type is used to identify phone numbers associated with a person's workplace or business. It can be used for professional communication, such as work-related calls.
 * - **Home**: This type represents phone numbers associated with a person's home or residential address. Home phone numbers are often used for personal and family-related communication.
 * - **Fax**: Fax numbers are used exclusively for sending and receiving facsimile (fax) documents. This type is used to distinguish fax numbers from regular voice communication numbers.
 * - **Main**: In a business context, the "main" phone number type may refer to the primary contact number for a company or organization. It is typically the main point of contact for general inquiries.
 * - **Emergency**: Some phone numbers, like 911 in the United States, are dedicated to emergency services. The "emergency" type can be used to identify such numbers.
 * - **Secondary/Alternative**: This type can be used for additional phone numbers associated with a person or organization. It may be a secondary mobile number, an alternative contact number, or a backup phone number.
 * - **Direct Line**: In a business context, a "direct line" phone number type can indicate a phone number that directly connects to a specific individual or department within an organization.
 * - **Customer Support**: This type can be used for phone numbers dedicated to customer support or helpdesk services, making it easier to identify and route customer-related inquiries.
 * - **Sales**: A "sales" phone number type can be used to identify phone numbers specifically for sales inquiries and contacts within a business.
 * - **Billing**: This type may be used for phone numbers related to billing inquiries or payment processing within a company.
 * - **Technical Support**: For technical support-related phone numbers, this type can be applied to help users easily differentiate them from other contact numbers.
 * - **Vendor/Supplier**: In a business-to-business context, this type can be used for phone numbers associated with vendors or suppliers.
 * - **Personal**: This type can represent a personal phone number that may not fit into the "mobile" or "home" categories, such as a dedicated personal business line.
 * - **Other**: An "other" category can be used for phone numbers with types that don't fit into any of the predefined categories. It allows for flexibility in classifying phone numbers with unique or specific uses.
 * @property {number} [pref=0] the preference used when contacting this number. This applies if there are multiple numbers stored
 * for a single contact. The value itself is in the range `[0, numOfPhones - 1]` where `numOfPhones` is number of phone numbers
 * that are saved to this one contact, and the range is from most to least important.
 */
/**
 * Parses the argument to a {@link PhoneRecord this js object}.
 * @callback PhoneGetter
 * @param {string} param value to be parsed. This is the format that it was saved from.
 * @returns {PhoneRecord} the formatted result of the argument
 */
/**
 * Formats the argument into an internal storage format
 * @callback PhoneSetter
 * @param {PhoneRecord} param the structure to be formatted
 * @returns {string} the string format of the argument where each value is separated by {@linkcode US ascii unit separator}.
 */
/**
 * @type {PhoneSetter}
 */
const s = function(x) {
    return `${(x.code??234).toString(23)}${String.fromCodePoint(US)}${x.number}${String.fromCodePoint(US)}${x.pref??0}${String.fromCodePoint(US)}${(x.type??"work").toLowerCase()}${String.fromCodePoint(US)}`
}
/**
 * @type {PhoneGetter}
 */
const g = function(x) {
    const a = x.split(String.fromCodePoint(US));
    const code = Number.parseInt(a.shift(), 23);
    const number = a.shift();
    const type = a.shift();
    const pref = Number.parseInt(a.shift());
    return {code, number, type, pref};
}
/**
 * @type {import("../data/d.cjs").Validater}
 */
const v = function(x) {
    const p = g(x);
    if(Number.isNaN(p.code) || (!Number.isFinite(p.code)) || p.code < 0  || p.code > 999) return false;
    if(p.number.trim().length <= 4) return false;
    if(p.pref < 0) return false;
    const en = ["mobile", "home", "work", "fax", "emergency", "main", "alt", "sec", "direct", "customer-support", "sales", "billing", "technical-support", "vendor", "supplier", "personal", "other"];
    return en.indexOf(p.type.toLowerCase()) >= 0;
}
/**
 * @type {import("../data/d.cjs").ErrMessage}
 */
const m = function(x) {
    const p = g(x.value);
    return `Validation failed. See docs for clues on why.
    ${p}`
}
/**
 * @typedef {Object} PhoneSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this phone number
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, PhoneSchemaConfig>} _p the actual phone value.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.Boolean, PhoneSchemaConfig>} _v
 * If `true`, then this phone number has been verified.
 */
/**
 * @type {PhoneSchemaConfig}
 */
const phone = {
    _id: mongoose.Schema.Types.ObjectId,
    _p: {
        type: mongoose.Schema.Types.String,
        validate: {
            validator: v,
            message: m
        },
        get: g,
        set: s,
        unique: true,
        required: true
    },
    _v: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
}

/**
 * uses the following for the second argument:
 * ```json
 * {
 *     timestamps: {
 *         createdAt: "_cAt",
 *         updatedAt: "_uAt"
 *     },
 *     versionKey: "_vk"
 * }
 * ```
 */
const PhoneSchema = new mongoose.Schema(phone, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The phone number of a contact.
 */
const Phone = mongoose.model("Phone", PhoneSchema);

module.exports = {
    PhoneSchema, Phone
}
