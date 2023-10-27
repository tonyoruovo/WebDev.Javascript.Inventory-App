
const { AmountSchema } = require("./amount.cjs")
// const { SupplierSchema } = require("./supplier.cjs")
const { Schema, model } = require("mongoose")

/**
 * Product models are meant to be immutable, hence whenever a price is changed, the old `Product` model
 * should be replaced with the new one as opposed to mutating an existing one and saving it.
 * @typedef {Object} ProductSchemaConfig
 * @property {Schema.Types.ObjectId} _id the mongoose id of this product
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ProductSchemaConfig>} _n the name of this product. The alias is `name`.
 * @property {import("../data/d.cjs").Options<[Schema.Types.String], ProductSchemaConfig>} _c the category of this product. The `alias` is `category`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ProductSchemaConfig>} _desc the description of this product. The `alias` is `description`.
 * @property {import("../data/d.cjs").Options<[Schema.Types.String], ProductSchemaConfig>} _l the array of url strings to the logo (dark, light)
 * and pictures of this product. The alias is `pics`.
 * @property {import("../data/d.cjs").Options<AmountSchema, ProductSchemaConfig>} _pr the price. The alias is `price`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ProductSchemaConfig>} _m the manufaturer. The alias is `manufacturer`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, ProductSchemaConfig>} _exp the expiry date. The alias is
 * `expiryDate`. 
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, ProductSchemaConfig>} _man the manufaturing date. The alias is
 * `manDate`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, ProductSchemaConfig>} _sp the supplier of this product. The
 * alias is `supplier` and ref is `Supplier`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Number, ProductSchemaConfig>} _q the quantity in stock. The alias is `quantityInStock`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Number, ProductSchemaConfig>} _rop the reorder point. The alias is `reorderPoint`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Buffer, ProductSchemaConfig>} _code the bar code, qr code or any other
 * unique identifier on the product/service. The alias is `code`.
 */
/**
 * @type {ProductSchemaConfig}
 */
const product = {
    _id: Schema.Types.ObjectId,
    _c: {
        type: [Schema.Types.String],
        alias: "category",
        minlength: 1,
        // index: true
    },
    _code: {
        type: Schema.Types.Buffer,
        alias: "code",
        required: true
    },
    _desc: {
        type: Schema.Types.String,
        alias: "description",
        minlength: 2
    },
    _exp: {
        type: Schema.Types.Date,
        min: new Date(),
        required: true,
        alias: "expiryDate"
    },
    _l: {
        type: [Schema.Types.String],
        alias: "pics"
    },
    _m: {
        type: Schema.Types.String,
        required: true,
        alias: "manufacturer"
    },
    _man: {
        type: Schema.Types.Date,
        alias: 'manDate',
        max: new Date()
    },
    _n: {
        type: Schema.Types.String,
        required: true,
        minlength: 1,
        trim: true,
        alias: "name"
    },
    _pr: {
        type: AmountSchema,
        alias: "price",
        required: true
    },
    _q: {
        type: Schema.Types.Number,
        min: 0,
        validate: {
            validator: function(x){
                return Number.isSafeInteger(x) && Number.isFinite(x) && !Number.isNaN(x)
            }
        },
        alias: "quantityInStock",
        default: 0
    },
    _rop: {
        type: Schema.Types.Number,
        min: 0,
        validate: {
            validator: function(x){
                return Number.isSafeInteger(x) && Number.isFinite(x) && !Number.isNaN(x)
            }
        },
        alias: "reorderPoint",
        required: true,
    },
    _sp: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
        alias: "supplier"
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
const ProductSchema = new Schema(product, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the product schema
 */
const Product = model("Product", ProductSchema);

module.exports = {
    ProductSchema, Product
}
