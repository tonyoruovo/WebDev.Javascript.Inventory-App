/**
 * An amount is either a bonus (to be reduced from the price) or a fee (charge(s) to added to
 * the price) on a price point to makeup the sum total
 * @module amount
 */

const { Schema, default: mongoose } = require("mongoose");

/**
 * Amount models are meant to be immutable, hence whenever a price is changed, the old `Amount` model
 * should be replaced with the new one as opposed to mutating an existing one and saving it.
 * @typedef {Object} AmountSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this amount.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, AmountSchemaConfig>} _expiresAt the duration of this amount
 * (for time sensitive amounts). Set to a very distant future (e.g 1000 years) to gain a permanent effect.
 * @property {import("../data/d.cjs").Options<Schema.Types.Number, AmountSchemaConfig>} _v the actual amount value. The
 * `alias` is `value`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AmountSchemaConfig>} _o the operator to use. The alias is `operator`.
 * Possible values include:
 * - `+`: adds to the base price i.e a deduction. This may include taxes, extra charges, fines etc. This is the default.
 * - `-`:  subtracts from the base price i.e a discount. This may include bonuses from promos, loyalty programmes etc.
 * @property {import("../data/d.cjs").Options<Schema.Types.String[], AmountSchemaConfig>} _op any additional operation(s) to perform.
 * The alias is `operations`. The possible values are:
 * - `n`: No operation is performed.
 * - `p`: Performs percent operation on the base price, i.e the value given by `_v` is the percentage to be added or subtracted
 * from the base price.
 * - `l`: Performs log operation using `_v` as the base and the base price as the argument i.e `log(basePrice, _v)`.
 * - `d`: Performs division where the divisor is `_v` and the dividend is the base price.
 * - `m`: Performs multiplication where the multiplier is `_v` and the multiplicand is the base price.
 * - `rt`: Performs a root function where the 'index' is the value given by `_v` and the 'radicand' is the base price.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AmountSchemaConfig>} _cc the 3-letter ISO currency code for
 * the currency in which this amount is set. The `alias` is `currencyCode`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AmountSchemaConfig>} _ct any relevant comments for this
 * `amount`. The `alias` is `comment`.
 */
/**
 * @type {AmountSchemaConfig}
 */
const amount = {
    _id: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    _v: {
        type: Schema.Types.String,
        required: true,
        alias: "value",
        immutable: true,
        match: [/^\d\d*\.?\d*/, "{VALUE} is not a decimal currency"]
    },
    _o: {
        type: Schema.Types.String,
        default: "+",
        alias: "operator",
        immutable: true,
        enum: ["+", "-"]
    },
    _op: {
        type: [{
            type: Schema.Types.String,
            enum: ["n", "p", "l", "d", "m", "rt"]
        }],
        alias: "operations",
        required: true,
        immutable: true
    },
    _cc: {
        type: Schema.Types.String,
        required: true,
        alias: "currencyCode",
        immutable: true,
        minlength: 3,
        maxlength: 3,
        // match: /[A-Za-z]{3}/
    },
    _ct: {
        type: Schema.Types.String,
        alias: "comment"
    },
    _expiresAt: {
        type: Schema.Types.Date,
        default: Date.now,
        // index: {
        //     expires: '0s'
        // }
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
 * },
 *   timeseries: {
 *       timeField: "_expiresAt",
 *       metaField: "_v",
 *       granularity: "seconds"
 *   }
 * ```
 * @type {Schema<AmountSchemaConfig>}
 */
const AmountSchema = new Schema(amount, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk",
    // timeseries: {
    //     timeField: "_expiresAt",
    //     metaField: "_v",
    //     granularity: "seconds"
    // }
});
/**
 * The model for the amount schema
 * @type {import("mongoose").Model<AmountSchemaConfig>}
 */
// const Amount = model("Amount", AmountSchema);
/**
 * Creates the `Amount` model using the given connection.
 * @param {import("mongoose").Connection} [c] The connection from which to create the model. If this instance was already connected, it will use the oldest connection specified by `mongoose.connections[0]`.
 * @returns {import("mongoose").Model<AmountSchemaConfig>} the `Amount` model created from the specified connection.
 */
const create = (c = mongoose.connections[0]) => c.model("Amount", AmountSchema);

module.exports = {
    AmountSchema, create
}
