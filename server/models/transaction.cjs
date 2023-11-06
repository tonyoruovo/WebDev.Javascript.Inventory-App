
const { Schema } = require("mongoose");
const { Order } = require("./order.cjs");
const { v } = require("../repo/utility.cjs");
const { Location } = require("./location.cjs");
const { Amount } = require("./amount.cjs");

/**
 * Transaction models are meant to be for a single order.
 * @typedef {Object} TransactionSchemaConfig
 * @property {Schema.Types.ObjectId} _id the mongoose id of this transaction
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, TransactionSchemaConfig>} _l the location id. This is the
 * place that responded to (or requested for) the order for the product of this transaction. The alias is `location`.
 * The ref is `Location`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, TransactionSchemaConfig>} _e the user/employee responsible for
 * tracking this product. The alias is `employee`, and the ref is `Employee`.
 * @property {import("../data/d.cjs").Options<[Schema.Types.ObjectId], TransactionSchemaConfig>} _ta any additional transaction
 * amount included to the sum total. The alias is `extraAmounts`, and the ref is `Amount`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, TransactionSchemaConfig>} _oid the id of the order that this
 * transaction is responding to (or requested for). The alias is `order`, and the ref is `Order`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, TransactionSchemaConfig>} _c comments for this transaction.
 * The alias is `comment`.
 */
/**
 * @type {TransactionSchemaConfig}
 */
const transaction = {
    _id: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    _ta: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Amount",
            validate: {
                validator: async function(x) {
                    return v(await Amount.findById(x).exec());
                },
                message: function(x) {
                    return `${x} does not exists as an amount`;
                }
            }
        }],
        alias: "extraAmounts"
    },
    _l: {
        type: Schema.Types.ObjectId,
        alias: "location",
        ref: "Location",
        required: true,
        validate: {
            validator: async function(x) {
                return v(await Location.findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exists as a location`;
            }
        }
    },
    _e: {
        type: Schema.Types.ObjectId,
        alias: "employee",
        ref: "Employee",
        required: true,
        validate: {
            validator: async function(x) {
                return v(await require("./employee.cjs").Employee.findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exists as an employee`;
            }
        }
    },
    _oid: {
        type: Schema.Types.ObjectId,
        alias: "order",
        ref: "Order",
        required: true,
        validate: {
            validator: async function(x) {
                return v(await Order.findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exists as an order`;
            }
        }
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
 * @type {Schema<TransactionSchemaConfig>}
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
 * @type {import("mongoose").Model<TransactionSchemaConfig>}
 */
// const Transaction = model("Transaction", TransactionSchema);
/**
 * Creates the `Transaction` model using the given connection.
 * @param {import("mongoose").Connection} c The connection from which to create the model.
 * @returns {import("mongoose").Model<TransactionSchemaConfig>} the `Transaction` model created from the specified connection.
 */
const create = c => c.model("Transaction", TransactionSchema);

module.exports = {
    TransactionSchema, create
}
