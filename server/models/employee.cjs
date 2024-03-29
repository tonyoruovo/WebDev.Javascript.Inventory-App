
const {Schema, default: mongoose} = require("mongoose");
const subject = require("./subject.cjs");
const { v } = require("../repo/utility.cjs");

/**
 * @typedef {Object} EmployeeSchemaConfig
 * @property {Schema.Types.ObjectId} _id the mongoose id of this employee.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, EmployeeSchemaConfig>} _s the subject of this employee. The
 * `alias` is `subject` and reference is `Subject`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Buffer, EmployeeSchemaConfig>} _sig the signature of this employee. The
 * `alias` is `signature`.
 * @todo will add this property {import("../data/d.cjs").Options<[RoleSchema], EmployeeSchemaConfig>} _r array of roles for this employee. the `alias`
 * is `roles`.
 */
/**
 * @type {EmployeeSchemaConfig}
 */
const employee = {
    _id: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    // _r: {
    //     type: [RoleSchema],
    //     alias: "roles"
    // },
    _s: {
        type: Schema.Types.ObjectId,
        alias: "subject",
        ref: "Subject",
        required: true,
        validate: {
            validator: async function(x) {
                return v(await subject.create().findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exist`;
            }
        }
    },
    _sig: {
        type: Schema.Types.Buffer,
        alias: "signature",
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
 * @type {Schema<EmployeeSchemaConfig>}
 */
const EmployeeSchema = new Schema(employee, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});
/**
 * The model for the employee schema
 * @type {import("mongoose").Model<EmployeeSchemaConfig>}
 */
// const Employee = model("Employee", EmployeeSchema);
/**
 * Creates the `Employee` model using the given connection.
 * @param {import("mongoose").Connection} [c] The connection from which to create the model. If this instance was already connected, it will use the oldest connection specified by `mongoose.connections[0]`.
 * @returns {import("mongoose").Model<EmployeeSchemaConfig>} the `Employee` model created from the specified connection.
 */
const create = (c = mongoose.connections[0]) => c.model("Employee", EmployeeSchema);

module.exports = {
    create, EmployeeSchema
}
