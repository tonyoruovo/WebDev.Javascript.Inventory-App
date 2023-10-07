
const mongoose = require("mongoose");

/**
 * A record of key values containing mongoose configurations for the `EmailSchema`.
 * @typedef {Object} EmailSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this email
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.String, EmailSchemaConfig>} _e the actual email value.
 * @property {import("../data/d.cjs").Options<mongoose.Schema.Types.Boolean, EmailSchemaConfig>} _v
 * If `true`, then this email has been verified.
 */
/**
 * @type {EmailSchemaConfig}
 */
const email = {
    _id: mongoose.Schema.Types.ObjectId,
    _e: {
        type: mongoose.Schema.Types.String,
        trim: true,
        match: /.*@.*/g,
        minlength: 3,
        unique: true,
        required: true,
        alias: "email"
    },
    _v: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
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
 * @type {mongoose.Schema}
 */
const EmailSchema = new mongoose.Schema(email, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});
/**
 * The email within a contact.
 */
const Email = new mongoose.model("Email", EmailSchema);

module.exports = {Email, EmailSchema};