
const mongoose = require("mongoose");

/**
 * A record of key values containing mongoose configurations for the `AddressSchema`.
 * @typedef {Object} AddressSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this address
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _s the street of the address value.
 * The name of the street together with any assigned number written in a locale specific way.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _l any landmark near the address. The
 * alias is `landmark`. Any popular structure/edifice which can be used to identify the given street
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _c the city if the address. The
 * alias is `city`. The city/town of the given street
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _z the zip code of the address. The
 * alias is `zip`. The zip code of the city/town of the given street
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _lg the local government of the
 * address. The alias is `lga`. The local government area or county of the given street
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _st the state of the address. The
 * alias is `state`. The state/region of the given street
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _cc the country code. The alias
 * is `countryCode`. The ISO country code where the given street is located. The default is `234`
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.Boolean, AddressSchemaConfig>} _v
 * If `true`, then this address has been verified.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _com The comment associated with
 * this address. The alias is `comments`. This may also act as a type specifier.
 */
/**
 * @type {AddressSchemaConfig}
 */
const address = {
    _id: mongoose.Schema.Types.ObjectId,
    _s: {
        type: mongoose.Schema.Types.String,
        trim: true,
        minlength: 1,
        required: true,
        alias: "street"
    },
    _l: {
        type: mongoose.Schema.Types.String,
        trim: true,
        minlength: 1,
        maxlength: 20,
        alias: "landmark"
    },
    _c: {
        type: mongoose.Schema.Types.String,
        trim: true,
        minlength: 1,
        maxlength: 20,
        required: true,
        alias: "city"
    },
    _z: {
        type: mongoose.Schema.Types.String,
        trim: true,
        match: /^\d\d*\d$/,
        required: true,
        alias: "zip"
    },
    _lg: {
        type: mongoose.Schema.Types.String,
        trim: true,
        minlength: 1,
        required: true,
        alias: "lga"
    },
    _st: {
        type: mongoose.Schema.Types.String,
        trim: true,
        minlength: 1,
        required: true,
        alias: "state"
    },
    _cc: {
        type: mongoose.Schema.Types.String,
        trim: true,
        match: /^\d\d\d$/,
        default: "234",
        alias: "countryCode"
    },
    _v: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    _com: {
        type: mongoose.Schema.Types.String,
        alias: "comment",
        minlength: 1,
        trim: true
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
 * @type {mongoose.Schema}
 */
const AddressSchema = new mongoose.Schema(address, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});
/**
 * The address within a contact.
 */
const Address = new mongoose.model("Address", AddressSchema);

module.exports = {Address, AddressSchema};