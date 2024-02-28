
const mongoose = require("mongoose");
const { US, GS, v } = require("../repo/utility.cjs");

/**
 * A class representing the full name of a person.
 * @typedef {Object} NameDoc
 * @property {string} name the person's first name
 * @property {string[]} others any other name that is not one of the others e.g nicknames
 * @property {string} surname the person's surname name
 * @property {string[]} preTitles any title to be prepended to the person's fullname e.g Mr, Mrs, Chief, Dr etc
 * @property {string[]} postTitles any title to be appended to the person's fullname e.g Ed, Phd etc
 */
/**
 * Checks if the argument is in the acceptable format of a `NameDoc`
 * @callback NameChecker
 * @param {string} name the full name of the person to be validated.
 * @returns {Promise<boolean>} `true` if the argument is valid or `false` if otherwise.
 */
/**
 * Validates the argument.
 * @type {NameChecker}
 */
const check = async function(x) {
    const n = g(x);
    // const exists = await Name.findById(name._id).exec();
    return v(n.name) && n.name.length >= 2 && v(n.surname) && n.surname.length >= 2;
    // return v(n.name) && n.name.length >= 2 && v(n.surname) && n.surname.length >= 2 && !exists;
}
/**
 * Gets a string message explaining why the check failed.
 * @callback CheckerErrMessage
 * @param {{value: string}} n The reference for proper construction of an error message.
 * @returns {string} the reason {@linkcode NameChecker} return `false`.
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
 * @callback NameSetter
 * @param {NameDoc} name the name to be formatted.
 * @returns {string} the formatted value.
 */
/**
 * Gets the name of a given person by parsing the stored string into an object.
 * @callback NameGetter
 * @param {string} name the formatted string to be parsed
 * @returns {NameDoc} the parsed value.
 */
/**
 * Sets the value to a given person
 * @type {NameSetter}
 */
const s = function (n) {
    return `${
        (n.preTitles??[]).map(x => x.toLowerCase()).sort().join(String.fromCharCode(US))
    }${
        String.fromCharCode(GS)
    }${
        n.name.toLowerCase()
    }${
        String.fromCharCode(GS)
    }${
        n.surname.toLowerCase()
    }${
        String.fromCharCode(GS)
    }${
        (n.others??[]).map(x => x.toLowerCase()).sort().join(String.fromCharCode(US))
    }${
        String.fromCharCode(GS)
    }${
        (n.postTitles??[]).map(x => x.toLowerCase()).sort().join(String.fromCharCode(US))
    }`
}
/**
 * Gets the value for a given person
 * @type {NameGetter}
 */
const g = function (n) {
    const f = (y) => {if(y.length < 1) return undefined; return y.split(String.fromCodePoint(US));}
    const v = n.split(String.fromCharCode(GS));
    const preTitles = f(v.shift());
    const name = v.shift();
    const surname = v.shift();
    const others = f(v.shift());
    const postTitles = f(v.pop());
    return { preTitles, name, surname, others, postTitles }
}
/**
 * A record of key values containing mongoose configurations for the `NameSchema`.
 * @typedef {Object} NameSchemaConfig
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, NameSchemaConfig>} _id the mongoose id of this person's name and the actual name value
 */
/**
 * @type {NameSchemaConfig}
 */
const name = {
    _id: {
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
const NameSchema = new mongoose.Schema(name, {
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
 * @type {import("mongoose").Model<NameSchemaConfig>}
 */
// const Name = mongoose.model("Name", NameSchema);
/**
 * Creates the `Name` model using the given connection.
 * @param {import("mongoose").Connection} [c] The connection from which to create the model. If this instance was already connected, it will use the oldest connection specified by `mongoose.connections[0]`.
 * @returns {import("mongoose").Model<NameSchemaConfig>} the `Name` model created from the specified connection.
 */
const create = (c = mongoose.connections[0]) => c.model("Name", NameSchema);

module.exports = {create, NameSchema};
