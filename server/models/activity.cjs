/**
 * The actions that an object takes within this api
 * @module activity
 */

const { Schema, model } = require("mongoose");

/**
 * @typedef {Object} ActivitySchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id for this activity.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, ActivitySchemaConfig>} s the initiator. The alias is `subject`. Although no ref is given, this is probably a reference to a document in the `Subject` or `Employee` collection.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, ActivitySchemaConfig>} o the receptor. The alias is `object`. Although no ref is given, this is probably a reference to a document in the `Subject` or `Employee` collection.
 * @property {import("../data/d.cjs").Options<Schema.Types.Boolean, ActivitySchemaConfig>} r did the action fail or succeed. The alias is `result`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} a is it `create`, `read`, `update` or
 * `delete`, `grant`, `revoke`? The alias is `action`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} mn the name of the collection on which
 * this activity was performed. The alias is `modelName`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} p the path to the property that was
 * mutated or read. The alias is `path`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, ActivitySchemaConfig>} rt the time stamp for when this
 * activity was recieved by the system. The alias is `receivedAt`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, ActivitySchemaConfig>} rst the time stamp for when this activity
 * was responded to by the system. The alias is `resultAt`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} sc for http requests. The status
 * code that this activity generated after being responded to. The alias is `statusCode`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} msg log messages from this activity.
 */
/**
 * @type {ActivitySchemaConfig}
 */
const activity = {
    _id: Schema.ObjectId,
    a: {
        type: Schema.Types.String,
        enum: ["create", "read", "update", "delete", "grant", "revoke"],
        required: true,
        alias: "action"
    },
    mn: {
        type: Schema.Types.String,
        required: true,
        alias: "modelName"
    },
    msg: Schema.Types.String,
    o: {
        type: Schema.Types.ObjectId,
        required: true,
        alias: "object"
    },
    p: {
        type: Schema.Types.String,
        required: true,
        minlength: 1,
        trim: true,
        alias: "path"
    },
    rt: {
        type: Schema.Types.Date,
        required: true,
        max: new Date(),
        alias: "receivedAt"
    },
    r: {
        type: Schema.Types.Boolean,
        required: true,
        alias: "result"
    },
    rst: {
        type: Schema.Types.Date,
        required: true,
        validate: {
            validator:
            /**
             * @param {Date} x
             */
            function(x) {
                /**
                 * @type {Date}
                 */
                const d = this.recievedAt;
                return x.getUTCFullYear() >= d.getUTCFullYear() && x.getUTCMonth() >= d.getUTCMonth() &&
                x.getUTCDate() >= d.getUTCDate() && x.getUTCHours() >= d.getUTCHours() && x.getUTCMinutes() >= d.getUTCMinutes() &&
                x.getUTCSeconds() >= d.getUTCSeconds() && x.getUTCMilliseconds() >= d.getUTCMilliseconds();
            }
        },
        alias: "resultAt"
    },
    sc: {
        type: Schema.Types.String,
        minlength: 3,
        maxlength: 3,
        match: /\d{3}/g,
        alias: "statusCode"
    },
    s: {
        type: Schema.Types.ObjectId,
        required: true,
        alias: "subject"
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
 * @type {Schema<ActivitySchemaConfig>}
 */
const ActivitySchema = new Schema(activity, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the activity
 * @type {import("mongoose").Model<ActivitySchemaConfig>}
 */
const Activity = model("Activity", ActivitySchema);

module.exports = {
    Activity, ActivitySchema
}
