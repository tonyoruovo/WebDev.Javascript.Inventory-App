
const mongoose = require("mongoose");
const { US } = require("../repos/utility.cjs");
/**
 * An object with structred address data.
 * @typedef {Object} AddressRecord
 * @property {string} streetName the name of the street
 * @property {string} [landmark=null] any popular structure/edifice which can be used to identify the given street
 * @property {string} city the city/town of the given street
 * @property {string} zip the zip code of the city/town of the given street
 * @property {string} lga the local government area or county of the given street
 * @property {string} state the state/region of the given street
 * @property {number} [code=234] the ISO country code where the given street is located. The default is `234`
 */
/**
 * Parses the argument to a {@link AddressRecord js object}.
 * @callback AddressGetter
 * @param {string} param value to be parsed. This is the format that it was saved from.
 * @returns {AddressRecord} the formatted result of the argument
 */
/**
 * 
 * Formats the argument into an internal storage format
 * @callback AddressSetter
 * @param {AddressRecord} param the structure to be formatted
 * @returns {string} the string format of the argument where each value is separated by {@linkcode US ascii unit separator}.
 */
/**
 * @type {AddressGetter}
 */
const g = function(x) {
    const a = x.split(String.fromCharCode(US));
    const streetName = a.shift();
    let landmark = a.shift();
    landmark = landmark.length > 0 ? landmark : null;
    const city = a.shift();
    const zip = a.shift();
    const lga = a.shift();
    const state = a.shift();
    const code = Number.parseInt(a.shift(), 35);
    return {
        streetName, landmark, city, zip, lga, state, code
    }
}
/**
 * @type {AddressSetter}
 */
const s = function(x) {
    return `${x.streetName}${String.fromCharCode(US)}${x.landmark??""}${String.fromCharCode(US)}${x.city}${String.fromCharCode(US)}${x.zip}${String.fromCharCode(US)}${x.lga}${String.fromCharCode(US)}${x.state}${String.fromCharCode(US)}${(x.code??234).toString(35)}${String.fromCharCode(US)}`;
}
/**
 * A record of key values containing mongoose configurations for the `AddressSchema`.
 * @typedef {Object} AddressSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this address
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _a the actual address value.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.Boolean, AddressSchemaConfig>} _v
 * If `true`, then this address has been verified.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, AddressSchemaConfig>} _c The comment associated with
 * this address. This may also act as a type specifier.
 */
/**
 * @type {AddressSchemaConfig}
 */
const address = {
    _id: mongoose.Schema.Types.ObjectId,
    _a: {
        type: mongoose.Schema.Types.String,
        validate: {
            validator: function(v) {
                return v && v.length >= 4;
            },
            message: function(props) {return `${props.value} is not a valid email`;}
        },
        get: g,
        set: s,
        required: true
    },
    _v: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    _c: {
        type: mongoose.Schema.Types.String,
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