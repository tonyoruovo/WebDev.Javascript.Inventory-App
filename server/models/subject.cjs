
const { Schema } = require("mongoose");
const { v } = require("../repo/utility.cjs");
const { Contact } = require("./contact.cjs");
const { PaymentTerm } = require("./paymentTerm.cjs");
const { Transaction } = require("./transaction.cjs");
const { Account } = require("./account.cjs");

/**
 * The subject of a transaction such as a customer, supplier, transfer agent (employee effecting the transfer)
 * @typedef {Object} SubjectSchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id for this subject.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, SubjectSchemaConfig>} _dob date of birth of this subject. The
 * alias is `dateOfBirth`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, SubjectSchemaConfig>} _g the gender of this subject. The
 * alias is `gender`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, SubjectSchemaConfig>} _c the contacts of this subject. The
 * alias is `contact`. The reference is `Contact`.
 * @property {import("../data/d.cjs").Options<[Schema.Types.ObjectId], SubjectSchemaConfig>} _th the transaction history of this
 * subject. The alias is `transactions`. The ref is `Transaction`.
 * @property {import("../data/d.cjs").Options<[Schema.Types.ObjectId], SubjectSchemaConfig>} _pt the payment terms for this
 * subject. The alias is `paymentTerms`. The ref is `PaymentTerm`.
 */
/**
 * @type {SubjectSchemaConfig}
 */
const subject = {
    _id: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    _c: {
        type: Schema.Types.ObjectId,
        ref: "Contact",
        validate: {
            validator: async function(x) {
                return v(await Contact.findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exists`;
            }
        }
    },
    _pt: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "PaymentTerm",
            validate: {
                validator: async function(x) {
                    return v(await PaymentTerm.findById(x).exec());
                },
                message: function(x) {
                    return `${x} does not exists`;
                }
            }
        }],
        alias: "paymentTerms"
    },
    _th: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Transaction",
            validate: {
                validator: async function(x) {
                    return v(await Transaction.findById(x).exec());
                },
                message: function(x) {
                    return `${x} does not exists`;
                }
            }
        }],
        alias: "transactions"
    },
    _dob: {
        type: Schema.Types.Date,
        alias: "dateOfBirth",
        required: [true, "Birth date is required"],
        min: new Date(new Date().getFullYear() - require("../../config.json").maxAge, 0, 1),
        max: new Date(new Date().getFullYear() - 18, 0, 1),
    },
    _g: {
        type: Schema.Types.String,
        enum: ["male", "female", "m", "f"],
        alias: "gender",
        required: [true, "Gender is required"]
    },
    _a: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        alias: "account",
        validate: {
            validator: async function(x) {
                return v(await Account.findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exists`;
            }
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
 * @type {Schema<SubjectSchemaConfig>}
 */
const SubjectSchema = new Schema(subject, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the subject
 * @type {import("mongoose").Model<SubjectSchemaConfig>}
 */
// const Subject = model("Subject", SubjectSchema);
/**
 * Creates the `Subject` model using the given connection.
 * @param {import("mongoose").Connection} c The connection from which to create the model.
 * @returns {import("mongoose").Model<SubjectSchemaConfig>} the `Subject` model created from the specified connection.
 */
const create = c => c.model("Subject", SubjectSchema);

module.exports = {
    create, SubjectSchema
}
