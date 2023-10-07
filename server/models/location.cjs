const { Schema, model } = require("mongoose");
const UnitSchema = new Schema({
    value: {
        type: Schema.Types.Number,
        min: 0,
        required: true
    },
    unit: {
        type: Schema.Types.String,
        required: true
    }
});
/**
 * @typedef {Object} LocationSchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id for this location.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, LocationSchemaConfig>} _c the contacts of this location. The
 * alias is `contact`. The reference is `Contact`.
 * @property {import("../data/d.cjs").Options<UnitSchema, LocationSchemaConfig>} _cp the capacity of this location. This
 * refers to maximum number of products it can store.
 * @property {import("../data/d.cjs").Options<[Schema.Types.ObjectId], LocationSchemaConfig>} _pt the payment terms for this
 * location. The alias is `paymentTerms`. The ref is `PaymentTerm`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Buffer, LocationSchemaConfig>} _s the signature of this location. The
 * alias is `signature`.
 * @property {import("../data/d.cjs").Options<[Schema.Types.String], LocationSchemaConfig>} _pc urls linking to any relevant picture
 * or logo. The alias is `pics`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, LocationSchemaConfig>} _ds default status for products arriving
 * at this location. The alias is `defaultStatus`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, LocationSchemaConfig>} _d description for this location.
 * The alias is `description`.
 */
/**
 * @type {LocationSchemaConfig}
 */
const location = {
    _id: Schema.Types.ObjectId,
    _c: {
        type: Schema.Types.ObjectId,
        ref: "Contact",
        required: true
    },
    _cp: {
        type: UnitSchema,
        alias: "capacity",
        required: true
    },
    _pt: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "PaymentTerm",
        }],
        alias: "paymentTerms"
    },
    _s: {
        type: Schema.Types.Buffer,
        alias: "signature"
    },
    _pc: {
        type: [Schema.Types.String],
        alias: "pics"
    },
    _ds: {
        type: Schema.Types.String,
        alias: "defaultStatus",
        enum: [`pending`, `recieved`, `canceled`, `shipped`, `approved`, `in-progress`, `completed`, `failed`, 'other'],
        default: "other"
    },
    _d: {
        type: Schema.Types.String,
        alias: "description",
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
const LocationSchema = new Schema(location, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the location
 */
const Location = model("Location", LocationSchema);
const Unit = model("Unit", UnitSchema);

module.exports = {
    Location, LocationSchema
}