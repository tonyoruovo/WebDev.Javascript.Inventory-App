
const mongoose = require("mongoose");
const { US, GS } = require("../repos/utility.cjs");
const { v } = require("../repos/utility.cjs");

/**
 * A class representing the full name of a person.
 * @typedef {Object} PersonName
 * @property {string} name the person's first name
 * @property {string[]} others any other name that is not one of the others e.g nicknames
 * @property {string} surname the person's surname name
 * @property {string[]} preTitles any title to be prepended to the person's fullname e.g Mr, Mrs, Chief, Dr etc
 * @property {string[]} postTitles any title to be appended to the person's fullname e.g Ed, Phd etc
 */
/**
 * Checks if the argument is in the acceptable format of a `PersonName`
 * @callback PersonNameChecker
 * @param {string} name the full name of the person to be validated.
 * @returns {boolean} `true` if the argument is valid or `false` if otherwise.
 */
/**
 * Validates the argument.
 * @type {PersonNameChecker}
 */
const check = function(x) {
    const n = g(x);
    return v(n) && v(n.name) && n.name.length >= 2 && v(n.surname) && n.surname.length >= 2;
}
/**
 * Gets a string message explaining why the check failed.
 * @callback CheckerErrMessage
 * @param {{value: string}} n The reference for proper construction of an error message.
 * @returns {string} the reason {@linkcode PersonNameChecker} return `false`.
 */
/**
 * Error message.
 * @type {CheckerErrMessage}
 */
const msg = function(x) {
    const n = g(x.value);
    return `name and surname property must be greater than 2.
    ${
        {
            name: n.name,
            surname: n.surname,
        }
    }
    `;
}
/**
 * Sets a person's name to the argument by stringifying it into a given format.
 * @callback PersonNameSetter
 * @param {PersonName} name the name to be formatted.
 * @returns {string} the formatted value.
 */
/**
 * Gets the name of a given person by parsing the stored string into an object.
 * @callback PersonNameGetter
 * @param {string} name the formatted string to be parsed
 * @returns {PersonName} the parsed value.
 */
/**
 * Sets the value to a given person
 * @type {PersonNameSetter}
 */
const s = function (n) {
    return `${(n.preTitles??[]).join(String.fromCharCode(US))}${String.fromCharCode(GS)}${n.name}${String.fromCharCode(GS)}${n.surname}${String.fromCharCode(GS)}${(n.others??[]).join(String.fromCharCode(US))}${String.fromCharCode(GS)}${(n.postTitles??[]).join(String.fromCharCode(US))}`
}
/**
 * Gets the value for a given person
 * @type {PersonNameGetter}
 */
const g = function (n) {
    const v = n.split(String.fromCharCode(GS));
    const preTitles = v.shift().split(String.fromCodePoint(US));
    const name = v.shift();
    const surname = v.shift();
    const others = v.shift().split(String.fromCodePoint(US));
    const postTitles = v.pop().split(String.fromCodePoint(US));
    return { preTitles, name, surname, others, postTitles }
}
/**
 * A record of key values containing mongoose configurations for the `PersonNameSchema`.
 * @typedef {Object} NameSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this person's name
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, NameSchemaConfig>} _n the actual name value
 */
/**
 * @type {NameSchemaConfig}
 */
const name = {
    _id: mongoose.Schema.Types.ObjectId,
    _n: {
        type: mongoose.Schema.Types.String,
        validate: {
            validator: check,
            message: msg
        },
        get: g,
        set: s,
        unique: true,
        required: true,
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
 * @type {mongoose.Schema<NameSchemaConfig>}
 */
const PersonNameSchema = new mongoose.Schema(name, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk",
    toJSON: {
        getters: true
    }
});
/**
 * The full name of a person.
 * @type {mongoose.Model<NameSchemaConfig>}
 */
const PersonName = mongoose.model("PersonName", PersonNameSchema);

module.exports = {PersonName, PersonNameSchema};
