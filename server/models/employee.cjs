
const {Schema, model} = require("mongoose");
const {RoleSchema} = require("./role.cjs");

/**
 * @typedef {Object} EmployeeSchemaConfig
 * @property {Schema.Types.ObjectId} _id the mongoose id of this employee.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, EmployeeSchemaConfig>} _dob the data of birth of this
 * employee. The `alias` is `birthDate`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, EmployeeSchemaConfig>} _c the contacts of this
 * employee. The `alias` is `contact`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, EmployeeSchemaConfig>} _g gender of this employee. Valid values
 * include `male`, `female`. The `alias` is `gender`.
 * @property {import("../data/d.cjs").Options<[RoleSchema], EmployeeSchemaConfig>} _r array of roles for this employee. the `alias`
 * is `roles`.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, EmployeeSchemaConfig>} _a the account of this employee. The `alias` is
 * `account` and reference is `Account`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Buffer, EmployeeSchemaConfig>} _s the signature of this employee. The `alias` is
 * `signature`.
 */
/**
 * @type {EmployeeSchemaConfig}
 */
const employee = {
    _id: Schema.Types.ObjectId,
    _dob: {
        type: Schema.Types.Date,
        alias: "birthDate",
        required: [true, "Birth date is required"],
        min: new Date(new Date().getFullYear() - require("../../config.json").maxAge, 0, 1),
        max: new Date(new Date().getFullYear() - 18, 0, 1),
    },
    _c: {
        type: Schema.Types.ObjectId,
        required: true,
        alias: "contact",
        ref: "Contact"
    },
    _g: {
        type: Schema.Types.String,
        enum: ["male", "female"],
        alias: "gender",
        required: [true, "Gender is required"]
    },
    _r: {
        type: [RoleSchema],
        alias: "roles"
    },
    _a: {
        type: Schema.Types.ObjectId,
        alias: "account",
        ref: "Account",
        required: function(){
            this._r.length > 0;
        }
    },
    _s: {
        type: Schema.Types.Buffer,
        alias: "signature"
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
})
/**
 * @typedefw {Object & Model<{},{},{},{},{}, EmployeeSchema>} EmployeeModel
 */
/**
 * The model for the employee schema
 * @type {import("mongoose").Model<EmployeeSchemaConfig>}
 */
const Employee = model("Employee", EmployeeSchema);

module.exports = {
    Employee, EmployeeSchema
}
