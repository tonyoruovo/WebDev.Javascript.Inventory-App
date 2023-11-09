const { v, compareDates } = require("../repo/utility.cjs");
const { Schema, default: mongoose } = require("mongoose");
const subject = require("./subject.cjs");
const amount = require("./amount.cjs");

/**
 * Product models are meant to be immutable, hence whenever a price is changed, the old `Product` model
 * should be replaced with the new one as opposed to mutating an existing one and saving it.
 * @typedef {Object} ProductSchemaConfig
 * @property {import("../data/d.cjs").Options<Schema.Types.Buffer, ProductSchemaConfig>} _id the mongoose id of this product, which
 * is also the bar code, qr code or any other unique identifier on the product/service. The alias is `code`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ProductSchemaConfig>} _n the name of this product. The alias is `name`.
 * @property {import("../data/d.cjs").Options<[Schema.Types.String], ProductSchemaConfig>} _c the categories of this product. The `alias` is `categories`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ProductSchemaConfig>} _desc the description of this product. The `alias` is `description`.
 *  In the future, this value would be an object whose keys are the properties of the product which may include:
 * - `color`
 * - `weight`
 * - `dietary info`
 * - `ingredients`
 * - `contents`
 * - `size`
 * - `model`
 * - `instructions`
 * - `units`
 * - `price per unit`
 * 
 * And any other relevant info. Note that the actual keys are arbitrary depending on the product, and are not subject to the above
 * @property {import("../data/d.cjs").Options<[Schema.Types.String], ProductSchemaConfig>} _l the array of url strings to the logo (dark, light)
 * and pictures of this product. The alias is `pics`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, ProductSchemaConfig>} _pr the price. The alias is `price`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ProductSchemaConfig>} _m the manufaturer. The alias is `manufacturer`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, ProductSchemaConfig>} _exp the expiry date. The alias is
 * `expiryDate`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, ProductSchemaConfig>} _man the manufaturing date. The alias is
 * `manDate`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, ProductSchemaConfig>} _sp the supplier of this product. The
 * alias is `supplier` and ref is `Supplier`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Number, ProductSchemaConfig>} _q the quantity in stock. The alias is `quantityInStock`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Number, ProductSchemaConfig>} _rop the reorder point. The alias is `reorderPoint`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Buffer, ProductSchemaConfig>} _code 
 */
/**
 * @type {ProductSchemaConfig}
 */
const product = {
	_id: {
		type: Schema.Types.Buffer,
		alias: "code",
		required: true,
		unique: true
	},
	_c: {
		type: [Schema.Types.String],
		alias: "categories",
		minlength: 1
		// index: true
	},
	_desc: {
		type: Schema.Types.String,
		alias: "description",
		minlength: 2
	},
	_exp: {
		type: Schema.Types.Date,
        validate: {
            validator: async function(x) {
				return compareDates(x, new Date(Date.now())) > 0;
            },
            message: function(x) {
                return `${x.value} is not a valid expiry date`;
            }
        },
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
		alias: "manDate",
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
		type: Schema.Types.ObjectId,
        ref: "Amount",
		alias: "price",
		required: true,
        validate: {
            validator: async function(x) {
                return v(await amount.create().findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exists as an amount`;
            }
        }
	},
	_q: {
		type: Schema.Types.Number,
		min: 0,
		validate: {
			validator: function (x) {
				return (
					Number.isSafeInteger(x) && Number.isFinite(x) && !Number.isNaN(x)
				);
			}
		},
		alias: "quantityInStock",
		default: 0
	},
	_rop: {
		type: Schema.Types.Number,
		min: 0,
		validate: {
			validator: function (x) {
				return (
					Number.isSafeInteger(x) && Number.isFinite(x) && !Number.isNaN(x)
				);
			}
		},
		alias: "reorderPoint",
		required: true
	},
	_sp: {
		type: Schema.Types.ObjectId,
		ref: "Subject",
		required: true,
		alias: "supplier",
        validate: {
            validator: async function(x) {
                return v(await subject.create().findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exists`;
            }
        }
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
 * @type {Schema<ProductSchemaConfig>}
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
 * @type {import("mongoose").Model<ProductSchemaConfig>}
 */
// const Product = model("Product", ProductSchema);
/**
 * Creates the `Product` model using the given connection.
 * @param {import("mongoose").Connection} [c] The connection from which to create the model. If this instance was already connected, it will use the oldest connection specified by `mongoose.connections[0]`.
 * @returns {import("mongoose").Model<ProductSchemaConfig>} the `Product` model created from the specified connection.
 */
const create = (c = mongoose.connections[0]) => c.model("Product", ProductSchema);

module.exports = {
	ProductSchema,
	create
};
