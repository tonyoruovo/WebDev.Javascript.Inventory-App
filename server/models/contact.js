const mongoose = require("mongoose");
const {EmailSchema} = require("./email.cjs");
const {PhoneSchema} = require("./phone.cjs");
const {AddressSchema} = require("./address.cjs");

/**
 * A record of key values containing mongoose configurations for the `ContactSchema`.
 * @typedef {Object} ContactSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this contact
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, ContactSchemaConfig>} _com_n the company name. The `alias`
 * is `companyName`
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.ObjectId, ContactSchemaConfig>} _n the personal name of the
 * contact. If the `companyName` is present, then this is the name of the genaral manager in-charge. This is a reference to a
 * `PersonName` model. The `alias` is `name`.
 * @property {import("../data/d.cjs").Options<[AddressSchema], ContactSchemaConfig>} _a the address of this contact. The `alias` is `addresses`.
 * @property {import("../data/d.cjs").Options<[EmailSchema], ContactSchemaConfig>} _e the email of this contact. The `alias` is `emails`. No need for references as explicitly
 * uses the {@linkcode EmailSchema} in it's type
 * @property {import("../data/d.cjs").Options<[mongoose.Schema.Types.String], ContactSchemaConfig>} _w the websites of this contact. The `alias` is `websites`
 * @property {import("../data/d.cjs").Options<[mongoose.Schema.Types.String], ContactSchemaConfig>} _s the social media of this contact. The `alias` is `socials`
 * @property {import("../data/d.cjs").Options<[PhoneSchema], ContactSchemaConfig>} _p the phone numbers of this contact. The `alias` is `numbers`. No need for references as explicitly
 * uses the {@linkcode PhoneSchema} in it's type
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, ContactSchemaConfig>} _nt This field can be a free-text
 * area where you can add any additional notes, comments, or specific instructions related to the contact. It's useful for adding
 * contextual information that might not fit neatly into other fields. The `alias` is `comments`.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, ContactSchemaConfig>} _pm You can include a field that
 * allows you to specify the preferred method of contact for the contact or organization. This could be email, phone, fax, or any
 * other communication channel they prefer. If this value is `social` or `other` then it should be specified in the `comments`
 * property. the `alias` is `mode`
 * @property {import("../data/d.cjs").Options<[mongoose.Schema.Types.String], ContactSchemaConfig>} _pp url to the profile picture(s). The `alias` is `profilePics`
 */
/**
 * @type {ContactSchemaConfig}
 */
const contact = {
    _id: mongoose.Schema.Types.ObjectId,
    _com_n: {
        type: mongoose.Schema.Types.String,
        unique: true,
        alias: "companyName",
        required: [function() {
            return this.name === null || this.name === undefined;
        }, "'name' and 'companyName' cannot both be empty"]
    },
    _n: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PersonName",
        alias: "name",
        required: [function() {
            return this.companyName === null || this.companyName === undefined;
        }, "'name' and 'companyName' cannot both be empty"]
    },
    _a: {
        type: [AddressSchema],
        // ref: "Address",
        alias: "addresses",
        required: [true, "Address is required"]
    },
    _w: {
        type: [mongoose.Schema.Types.String],
        alias: "websites"
    },
    _s: {
        type: [mongoose.Schema.Types.String],
        alias: "socials"
    },
    _nt: {
        type: [mongoose.Schema.Types.String],
        alias: "comments"
    },
    _pp: {
        type: [mongoose.Schema.Types.String],
        alias: "profilePics"
    },
    _e: {
        type: [EmailSchema],
        // ref: "Email",
        alias: "emails",
        required: [function() {
            return this.numbers === null || this.numbers === undefined || this.numbers.length === 0;
        }, "email or phone number is needed"]
    },
    _p: {
        type: [PhoneSchema],
        // ref: "Phone",
        alias: "numbers",
        required: [function() {
            return this.emails === null || this.emails === undefined || this.emails.length === 0;
        }, "email or phone number is needed"]
    },
    _pm: {
        type: mongoose.Schema.Types.String,
        alias: "mode",
        enum: {
            values: ["call", "sms", "email", "social", "other"],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`.'
        }
    }
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
const ContactSchema = new mongoose.Schema(contact, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});
/**
 * The contact model.
 * 
 * - Associated with suppliers, customers, employees, and possibly other entities like manufacturers or distributors.
 * - The Contact Model allows you to centralize and manage contact information for various entities that interact with your
 * inventory management system. This can help in tracking and communicating with suppliers, customers, and employees efficiently.
 * Each contact can be associated with relevant entities in the system, such as linking a contact to a specific supplier or
 * customer.
 */
const Contact = mongoose.model("Contact", ContactSchema);

module.exports = {Contact, ContactSchema};
