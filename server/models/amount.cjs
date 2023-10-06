/**
 * An amount is either a bonus (to be reduced from the price) or a fee (charge(s) to added to
 * the price) on a price point to makeup the sum total
 * @module amount
 */

import { Schema, model } from "mongoose"

/**
 * Amount models are meant to be immutable, hence whenever a price is changed, the old `Amount` model
 * should be replaced with the new one as opposed to mutating an existing one and saving it.
 * @typedef {Object} AmountSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this amount
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, AmountSchemaConfig>} _expiresAt the duration of this amount
 * (for time sensitive amounts). Set to a very distant future (e.g 1000 years) to gain a permanent effect.
 * @property {import("../data/d.cjs").Options<Schema.Types.Number, AmountSchemaConfig>} _v the actual amount value. The
 * `alias` is `value`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AmountSchemaConfig>} _t the `amount` type. The `alias`
 * is `dType`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AmountSchemaConfig>} _cc the 3-letter ISO currency code for
 * the currency in which this amount is set. The `alias` is `currencyCode`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AmountSchemaConfig>} _ct any relevant comments for this
 * `amount`. The `alias` is `comment`.
 */
/**
 * @type {AmountSchemaConfig}
 */
const amount = {
    _id: Schema.Types.ObjectId,
    _v: {
        type: Schema.Types.String,
        required: true,
        alias: "value",
        immutable: true,
        match: [/^\d\d*\.?\d*/, "{VALUE} is not a decimal currency"]
    },
    _t: {
        type: Schema.Types.String,
        required: true,
        alias: "dType",
        immutable: true,
        enum: ["a", "add", "subtract", "s", "multiply", "m", "divide", "d", "sqrt", "cbrt", "exp", "percent", "log"],
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
        index: {
            expires: '0s'
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
 * },
 *   timeseries: {
 *       timeField: "_expiresAt",
 *       metaField: "_v",
 *       granularity: "seconds"
 *   }
 * ```
 */
const AmountSchema = new Schema(amount, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk",
    timeseries: {
        timeField: "_expiresAt",
        metaField: "_v",
        granularity: "seconds"
    }
});

/**
 * The model for the amount schema
 */
const Amount = model("Amount", AmountSchema);

module.exports = {
    Amount, AmountSchema,
}
