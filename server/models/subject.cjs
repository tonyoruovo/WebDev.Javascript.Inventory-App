
const { Schema, model } = require("mongoose");

/**
 * The subject of a transaction such as a customer, supplier, transfer agent (employee effecting the transfer)
 * @typedef {Object} SubjectSchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id for this subject.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, CustomerSchemaConfig>} _c the contacts of this subject. The
 * alias is `contact`. The reference is `Contact`.
 * @property {import("../data/d.cjs").Options<[Schema.Types.ObjectId], CustomerSchemaConfig>} _th the transaction history of this
 * subject. The alias is `transactions`. The ref is `Transaction`.
 * @property {import("../data/d.cjs").Options<[Schema.Types.ObjectId], SupplierSchemaConfig>} _pt the payment terms for this
 * subject. The alias is `paymentTerms`. The ref is `PaymentTerm`
 */
/**
 * @type {SubjectSchemaConfig}
 */
const subject = {
    _id: Schema.Types.ObjectId,
    _c: {
        type: Schema.Types.ObjectId,
        ref: "Contact"
    },
    _pt: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "PaymentTerm",
        }],
        alias: "paymentTerms"
    },
    _th: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Transaction",
        }],
        alias: "transactions"
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
const SubjectSchema = new Schema(subject, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the subject
 */
const Subject = model("Subject", SubjectSchema);

module.exports = {
    Subject, SubjectSchema
}
