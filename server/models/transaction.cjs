
const { Schema, model } = require("mongoose")

/**
 * Amount models are meant to be immutable, hence whenever a price is changed, the old `Amount` model
 * should be replaced with the new one as opposed to mutating an existing one and saving it.
 * @typedef {Object} TransactionSchemaConfig
 * @property {Schema.Types.ObjectId} _id the mongoose id of this transaction
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, TransactionSchemaConfig>} _p the product id. This is the
 * object of this transaction. The alias is `product`. The ref is `Product`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, TransactionSchemaConfig>} _l the location id. This is the
 * place that responded to (or requested for) the order for the product of this transaction. The alias is `location`.
 * The ref is `Location`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, TransactionSchemaConfig>} _e the user/employee responsible for
 * tracking this product. The alias is `employee`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, TransactionSchemaConfig>} _oid the id of the order that this
 * transaction is responding to (or requested for). The alias is `order`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, TransactionSchemaConfig>} _c comments for this transaction.
 * The alias is `comment`.
 */
/**
 * @type {TransactionSchemaConfig}
 */
const transaction = {
    _id: Schema.ObjectId,
    _p: {
        type: Schema.Types.ObjectId,
        alias: "product",
        ref: "Product",
        required: true
    },
    _l: {
        type: Schema.Types.ObjectId,
        alias: "location",
        ref: "Location",
        required: true
    },
    _e: {
        type: Schema.Types.ObjectId,
        alias: "employee",
        ref: "Employee",
        required: true
    },
    _oid: {
        type: Schema.Types.ObjectId,
        alias: "order",
        ref: "Order",
        required: true
    },
    _c: {
        type: Schema.Types.String,
        alias: "comment"
    }
};

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
const TransactionSchema = new Schema(transaction, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the transaction schema
 */
const Transaction = model("Transaction", TransactionSchema);

module.exports = {
    TransactionSchema, Transaction
}