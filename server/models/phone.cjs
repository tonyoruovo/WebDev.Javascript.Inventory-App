
const mongoose = require("mongoose");

/**
 * @typedef {Object} PhoneSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this phone number.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, PhoneSchemaConfig>} _n the actual phone value.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, PhoneSchemaConfig>} _c the country code. The ISO
 * country code of the given phone number
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.Number, PhoneSchemaConfig>} _pf the preference of this number.
 * The alias is `preference`. The preference used when contacting this number. This applies if there are multiple numbers stored
 * for a single contact. The value itself is in the range `[0, numOfPhones - 1]`, where `numOfPhones` is number of phone numbers
 * that are saved to this one contact, and the range is from most to least important.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, PhoneSchemaConfig>} _t the type of number.
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
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.Boolean, PhoneSchemaConfig>} _v
 * If `true`, then this phone number has been verified.
 */
/**
 * @type {PhoneSchemaConfig}
 */
const phone = {
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true
    },
    _n: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true,
        alias:"number",
        minlength: 11,
        maxlength: 11,
        match: /^\d\d{9}\d$/g
    },
    _t: {
        type: mongoose.Schema.Types.String,
        alias:"numberType",
        default: "work",
        enum: ["mobile", "home", "work", "fax", "emergency", "main", "alt", "sec", "direct", "customer-support", "sales", "billing", "technical-support", "vendor", "supplier", "personal", "other"]
    },
    _pf: {
        type: mongoose.Schema.Types.Number,
        alias:"preference",
        min: 0,
        default: 0
    },
    _c: {
        type: mongoose.Schema.Types.String,
        match: /^\d{1,3}$/g,
        default: "234",
        alias: "countryCode"
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
 * @type {mongoose.Schema<PhoneSchemaConfig>}
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
 * @type {mongoose.Model<PhoneSchemaConfig>}
 */
// const Phone = mongoose.model("Phone", PhoneSchema);
/**
 * Creates the `Phone` model using the given connection.
 * @param {import("mongoose").Connection} c The connection from which to create the model.
 * @returns {import("mongoose").Model<PhoneSchemaConfig>} the `Phone` model created from the specified connection.
 */
const create = c => c.model("Phone", PhoneSchema);

module.exports = {
    PhoneSchema, create
}
