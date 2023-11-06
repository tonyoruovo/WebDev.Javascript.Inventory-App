
const mongoose = require("mongoose");
// const { v } = require("../repo/utility.cjs");

/**
 * A record of key values containing mongoose configurations for the `EmailSchema`.
 * @typedef {Object} EmailSchemaConfig
 * @property {mongoose.Schema.Types.ObjectId} _id the mongoose id of this email.
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
        match: /.+@.+/g,
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
 * @type {mongoose.Schema<EmailSchemaConfig>}
 */
const EmailSchema = new mongoose.Schema(email, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});
// EmailSchema.pre("save", async function(n) {
//     const r = await Email.findOne({
//         _e: this._e
//     }).exec()
//     if(v(r)) return n(Error("Duplicate email found"));
//     n();
// })
/**
 * The email within a contact.
 * @type {mongoose.Model<EmailSchemaConfig>}
 */
// const Email = mongoose.model("Email", EmailSchema);
/**
 * Creates the `Email` model using the given connection.
 * @param {import("mongoose").Connection} c The connection from which to create the model.
 * @returns {import("mongoose").Model<EmailSchemaConfig>} the `Email` model created from the specified connection.
 */
const create = c => c.model("Email", EmailSchema);

module.exports = {EmailSchema, create};