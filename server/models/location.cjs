const { Schema } = require("mongoose");
const { v } = require("../repo/utility.cjs");
const { PaymentTerm } = require("./paymentTerm.cjs");
const { Contact } = require("./contact.cjs");
/**
 * @typedef {Object} UnitSchemaConfig
 * @property {Schema.Types.ObjectId} _id
 * @property {import("../data/d.cjs").Options<Schema.Types.Number, UnitSchemaConfig>} _v the numerical value. The alias is `value`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, UnitSchemaConfig>} _u the unit of measurement such as "kilogram", "kilogramme", "kg" etc. The alias is `unit`.
 */
/**
 * @type {UnitSchemaConfig}
 */
const unit = {
    _v: {
        type: Schema.Types.Number,
        min: 0,
        required: true,
        alias: "value"
    },
    _u: {
        type: Schema.Types.String,
        required: true,
        alias: "unit",
        lowercase: true
    }
}
/**
 * The instantiated `UnitSchema` object.
 * @type {Schema<UnitSchemaConfig>}
 */
const UnitSchema = new Schema(unit);
/**
 * @typedef {Object} LocationSchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id for this location.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, LocationSchemaConfig>} _c the contacts of this location. The
 * alias is `contact`. The reference is `Contact`.
 * @property {import("../data/d.cjs").Options<UnitSchemaConfig, LocationSchemaConfig>} _cp the capacity of this location. This
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
        required: true,
        validate: {
            validator: async function(x) {
                return v(await Contact.findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exists as an amount`;
            }
        }
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
            validate: {
                validator: async function(x) {
                    return v(await PaymentTerm.findById(x).exec());
                },
                message: function(x) {
                    return `${x} does not exists as an amount`;
                }
            }
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
        enum: ["pending", "recieved", "canceled", "shipped", "approved", "in-progress", "completed", "failed", 'other'],
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
 * @type {Schema<LocationSchemaConfig>}
 */
const LocationSchema = new Schema(location, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});
// LocationSchema.plugin(() => )
/**
 * The model for the location
 * @type {import("mongoose").Model<LocationSchemaConfig>}
 */
// const Location = model("Location", LocationSchema);
/**
 * Creates the `Location` (or `Unit`) model using the given connection.
 * @param {import("mongoose").Connection} c The connection from which to create the model.
 * @param {boolean} l use location model? if yes then `Location` model will be returned, else a `Unit` model is returned.
 * @returns {import("mongoose").Model<LocationSchemaConfig | UnitSchemaConfig>} the `Location` (or `Unit`) model created from the specified connection.
 */
const create = (c,l = true) => l ? c.model("Location", LocationSchema) : c.model("Unit",UnitSchema);
/**
 * The model for the unit
 * @type {import("mongoose").Model<UnitSchemaConfig>}
 */
// const Unit = model("Unit", UnitSchema);

module.exports = {
    create, LocationSchema, UnitSchema
}