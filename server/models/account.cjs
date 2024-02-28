const { Schema, default: mongoose } = require("mongoose");
const { defMsg } = require("../data/d.cjs");
const { v } = require("../repo/utility.cjs");
const email = require("./email.cjs");

/**
 * @typedef {Object} AccountSchemaConfig
 * @property {Schema.Types.ObjectId} _id the mongoose id of this account.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, AccountSchemaConfig>} _e the email.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AccountSchemaConfig>} _u the username. The range is [3, 24].
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AccountSchemaConfig>} _h the hashed pass.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AccountSchemaConfig>} _s the status.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AccountSchemaConfig>} _p the provider (for external accounts such as facebook, google, twitter).
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AccountSchemaConfig>} _pid the provider id.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AccountSchemaConfig>} _at the provider access token.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AccountSchemaConfig>} _rt the provider refresh token (for oauth).
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AccountSchemaConfig>} _ats the provider access token secret (for twitter).
 */
/**
 * @type {AccountSchemaConfig}
 */
const account = {
    _id: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    _e: {
        type: [{
            type: Schema.Types.ObjectId,
            unique: true,
            ref: "Email",
            required: true,
            validate: {
                validator: async function(x) {
                    return v(await email.create().findById(x).exec());
                },
                message: function(x) {
                    return `${x} does not exists`;
                }
            }
        }],
        alias: "emails",
        required: [true, "email or phone number is needed"]
    },
    _u: {
        type: Schema.Types.String,
        validate: {
            validator: function(x) {
                return v(x) && x.length >= 3 && x.length <= 24;
            },
            message: defMsg
        },
        required: [function(){
            return !v(this._p);
        }, "username must be provided"],
        unique: true,
        alias: "username"
    },
    _h: {
        type: Schema.Types.String,
        validate: {
            validator: function(x) {
                return v(x) && x.length > 6;
            },
            message: defMsg
        },
        required: [true, "password must be provided"]
    },
    _s: {
        type: Schema.Types.String,
        enum: ["active", "disabled", "suspended", "pending", "locked"],
        required: [true, "no status was provided"],
        default: "pending"
    },
    _p: {
        type: Schema.Types.String,
        validate: {
            validator: function(x){
                return v(x) && x.trim().length > 0;
            },
            message: function(x) {
                return `The provider name ${x.value}, is invalid. An empty string is not allowed.`
            }
        },
        required: function(){
            return !v(this._u);
        }
    },
    _pid: {
        type: Schema.Types.String,
        required: function() {
            return v(this._p);
        },
        validate: {
            validator: function(x){
                return v(x) && x.trim().length > 0;
            },
            message: function(x) {
                return `The provider id ${x.value}, is invalid. An empty string is not allowed.`
            }
        }
    },
    _at: {
        type: Schema.Types.String,
        required: function() {
            return v(this._p);
        },
        validate: {
            validator: function(x){
                return v(x) && x.trim().length > 0;
            },
            message: function(x) {
                return `The provider access token ${x.value}, is invalid. An empty string is not allowed.`
            }
        }
    },
    _rt: {
        type: Schema.Types.String,
        required: function() {
            return v(this._p);
        },
        validate: {
            validator: function(x){
                return v(x) && x.trim().length > 0;
            },
            message: function(x) {
                return `The provider refresh token ${x.value}, is invalid. An empty string is not allowed.`
            }
        }
    },
    _ats: {
        type: Schema.Types.String,
        required: function() {
            return v(this._p);
        },
        validate: {
            validator: function(x){
                return v(x) && x.trim().length > 0;
            },
            message: function(x) {
                return `The provider access token secret ${x.value}, is invalid. An empty string is not allowed.`
            }
        }
    },
};
/**
 * @type {import("../data/d.cjs").MongooseSchemaOptions}
 */
const option = {
    toJSON: {
        aliases: true,
        versionKey: false,
        getters: true,
        minimize: true,
        virtuals: true
    },
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
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
 * @type {Schema<AccountSchemaConfig>}
 */
const AccountSchema = new Schema(account, option);
/**
 * The model for the account
 * @type {import("mongoose").Model<AccountSchemaConfig>}
 */
// const Account = model("Account", AccountSchema);
/**
 * Creates the `Account` model using the given connection.
 * @param {import("mongoose").Connection} [c] The connection from which to create the model. If this instance was already connected, it will use the oldest connection specified by `mongoose.connections[0]`.
 * @returns {import("mongoose").Model<AccountSchemaConfig>} the `Account` model created from the specified connection.
 */
const create = (c = mongoose.connections[0]) => c.model("Account", AccountSchema);

module.exports = {
    AccountSchema, create
}