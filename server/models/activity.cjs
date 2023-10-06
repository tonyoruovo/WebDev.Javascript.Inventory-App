/**
 * The actions that an object takes within this api
 * @module activity
 */

const { Schema, model } = require("mongoose");

/**
 * @typedef {Object} ActivitySchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id for this activity.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, ActivitySchemaConfig>} subject the initiator
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, ActivitySchemaConfig>} object the receptor
 * @property {import("../data/d.cjs").Options<Schema.Types.Boolean, ActivitySchemaConfig>} result did the action fail or succed
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} action is it `create`, `read`, `update` or
 * `delete`, `grant`, `revoke`?
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} modelName the name of the table on which
 * this activity was performed.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} path the path to the property that was
 * mutated or read.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, ActivitySchemaConfig>} recievedAt the time stamp for when this
 * activity was recieved by the system.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, ActivitySchemaConfig>} resultAt the time stamp for when this activity
 * was responded to by the system.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} statusCode for http requests. The status
 * code that this activity generated after being responded to.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ActivitySchemaConfig>} msg log messages from this activity.
 */
/**
 * @type {ActivitySchemaConfig}
 */
const activity = {
    _id: Schema.ObjectId,
    action: {
        type: Schema.Types.String,
        enum: ["create", "read", "update", "delete"],
        required: true
    },
    modelName: {
        type: Schema.Types.String,
        required: true
    },
    msg: Schema.Types.String,
    object: {
        type: Schema.Types.ObjectId,
        required: true
    },
    path: {
        type: Schema.Types.String,
        required: true,
        minlength: 1,
        trim: true
    },
    recievedAt: {
        type: Schema.Types.Date,
        required: true,
        max: new Date()
    },
    result: {
        type: Schema.Types.Boolean,
        required: true
    },
    resultAt: {
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
        }
    },
    statusCode: {
        type: Schema.Types.String,
        minlength: 3,
        maxlength: 3,
        match: /\d{3}/g
    },
    subject: {
        type: Schema.Types.ObjectId,
        required: true
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
const ActivitySchema = new Schema(activity, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the activity
 */
const Activity = model("Activity", ActivitySchema);

module.exports = {
    Activity, ActivitySchema
}
