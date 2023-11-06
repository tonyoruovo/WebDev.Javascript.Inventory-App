const { Schema, Types } = require("mongoose");

/**
 * An identifier of a given action in this api. When used in combination with authorization, it may represent the given duties and
 * permissions of an employee.\
 * \
 * a "Role" or "Permission Level" property to control access to different parts of the system and determine what actions a user can
 * perform. Here are further details on roles and permission levels that can be associated with the user model:
 * 1. Administrator:
 * - Permissions: Full access to all features and data within the inventory management software.
 * - Responsibilities: Administrators have the highest level of access and can perform tasks such as user management, system
 * configuration, data management, and generating reports. They can modify system settings, add or remove users, and oversee all aspects of the software.
 * 2. Manager/Supervisor:
 * - Permissions: Substantial access to data and system functionality but with some restrictions compared to administrators.
 * - Responsibilities: Managers or supervisors can typically view, edit, and manage inventory data, including products, locations,
 * transactions, and user accounts. They may have the authority to approve or reject certain actions, such as purchase orders or
 * inventory transfers.
 * 3. Inventory Clerk:
 * - Permissions: Limited access primarily focused on inventory-related tasks.
 * - Responsibilities: Inventory clerks are responsible for day-to-day inventory management tasks, including adding and updating
 * product information, conducting stock checks, and managing inventory transactions. They may not have access to sensitive financial
 * or configuration settings.
 * Sales Representative:
 * - Permissions: Access to customer and sales-related data.
 * - Responsibilities: Sales representatives can view and manage customer information, create sales orders, and track sales-related
 * activities. They may not have access to inventory management or administrative functions.
 * 4. Purchasing Agent:
 * - Permissions: Access to supplier and purchase-related data.
 * - Responsibilities: Purchasing agents focus on procurement tasks, such as creating purchase orders, managing supplier
 * relationships, and tracking inventory replenishment. They may not have access to sales-related functions.
 * 5. Customer Support:
 * - Permissions: Access to customer information and support-related functions.
 * - Responsibilities: Customer support personnel can access customer data, view sales orders and purchase history, and assist
 * customers with inquiries or issues. They may not have access to financial or administrative functions.
 * 6. Viewer/Read-Only:
 * - Permissions: Limited to read-only access.
 * - Responsibilities: Viewers have restricted access and can only view data without making changes. This role is suitable for
 * individuals who need to access information for reference or reporting purposes but do not perform data modifications.
 * 7. Custom Roles:
 * - Permissions: Customized based on specific requirements.
 * - Responsibilities: In some systems, you may have the flexibility to define custom roles with permissions tailored to unique
 * organizational needs. These roles can vary widely depending on the organization's structure and processes.
 * It's essential to carefully define and configure these roles and permission levels in your inventory management software to
 * ensure data security, integrity, and proper access control. Role-based access control (RBAC) allows you to assign the appropriate
 * level of access to each user based on their responsibilities within the organization. Additionally, you may implement additional
 * security measures, such as authentication and authorization mechanisms, to protect sensitive data and ensure that users can only
 * perform authorized actions. \
 * \
 * Role-Based Access Control (RBAC) is a widely used access control model that restricts system access to authorized users based
 * on their roles and permissions. Implementing RBAC involves defining roles, assigning permissions to those roles, and
 * associating users with specific roles. Here's a step-by-step guide on how to implement RBAC:
 * 1. **Identify Roles**:
 *    - Begin by identifying the different roles within your system. Roles represent the various job functions or responsibilities
 * that users may have. Common roles include Administrator, Manager, Clerk, Sales Representative, and more.
 * 2. **Define Permissions**:
 *    - Determine the specific permissions or actions that each role is allowed to perform within the system. Permissions can be
 * fine-grained and should cover every action or data access point in your application.
 *    - Permissions can include actions like "Create Purchase Order," "View Sales Reports," "Edit Product Details," and so on.
 * 3. **Assign Permissions to Roles**:
 *    - Associate each role with a set of permissions. This defines what users in a particular role can and cannot do.
 *    - Consider creating role-based permission templates to simplify this process. For example, a "Manager" role might inherit
 * permissions related to data management, while a "Clerk" role may inherit permissions for inventory updates.
 * 4. **Create User-Role Relationships**:
 *    - Assign each user to one or more roles. This establishes the user's identity within the RBAC system and determines the
 * actions they can perform.
 *    - Users can have one or more roles simultaneously, depending on their job responsibilities.
 * 5. **Implement Access Control Logic**:
 *    - In your application code, implement access control logic that enforces RBAC. This logic should check whether a user has
 * the necessary permissions to perform a specific action or access certain data.
 *    - For example, when a user attempts to edit a product, the system should verify if their role allows them to do so.
 * 6. **Handle Role Changes and Updates**:
 *    - Develop mechanisms to handle changes in user roles or permission updates. When a user's role changes, their access rights
 * should be updated accordingly.
 *    - Implement workflows for role assignment and revocation, and ensure that users receive appropriate notifications.
 * 7. **Logging and Auditing**:
 *    - Implement logging and auditing features to keep a record of user actions and access requests. This is crucial for security
 * and compliance.
 *    - Log both successful and failed access attempts to help track and investigate security incidents.
 * 8. **Testing and Quality Assurance**:
 *    - Thoroughly test the RBAC implementation to ensure that roles and permissions are correctly enforced. Test various
 * scenarios to identify and address any access control vulnerabilities or issues.
 * 9. **Documentation and Training**:
 *    - Document the roles, permissions, and access control policies in your system. Provide training for administrators and users
 * so they understand how RBAC works and how to manage user roles.
 * 10. **Regular Review and Maintenance**:
 *     - RBAC is not a one-time setup; it requires regular maintenance and reviews. As your system evolves, roles and permissions
 * may need adjustments to accommodate changes in business processes or security requirements.
 * 11. **Security and Monitoring**:
 *     - Implement security measures to protect the RBAC system itself. Monitor for suspicious activity, and ensure that sensitive
 * data, such as role assignments, is securely stored and transmitted.
 * 12. **Compliance and Reporting**:
 *     - Ensure that your RBAC implementation meets any regulatory or compliance requirements relevant to your industry. Generate
 * reports and audits to demonstrate compliance when necessary.
 * By following these steps, you can effectively implement RBAC in your application, improving security, simplifying user
 * management, and ensuring that users have the appropriate level of access to perform their roles and responsibilities within the system.
 * @typedef {Object} RoleSchemaConfig
 * @property {Types.ObjectId} _id the mongoose id of this role.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, RoleSchemaConfig>} _p the pay load. This is the url, file name or
 * path to the object/function that this employee can access. The `alias` is `payload`.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, RoleSchemaConfig>} _e the specifying the time in which this
 * permission will expire for time-sensitive permissions. If this is not a time sensitive permission, then 
 * @property {import("../data/d.cjs").Options<Types.ObjectId, RoleSchemaConfig>} _is the account that granted this
 * role. The `alias` is `issuer` and the reference is `Employee`. id of the employee that signed off on this permission. It must
 * be the id of an admin.
 */
/**
 * @type {RoleSchemaConfig}
 */
const role = {
    _id: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    _is: {
        type: Types.ObjectId,
        immutable: true,
        ref: "Employee",
        alias: "issuer"
    },
    _p: {
        type: Schema.Types.String,
        alias: "payload",
        immutable: true
    },
    _e: {
        type: Schema.Types.Date,
        immutable: true,
        alias: "expiresAt",
        required: true,
        index: {
            expires: '0s'
        }
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
const RoleSchema = new Schema(role, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk",
    timeseries: {
        timeField: "_e",
        metaField: "_p",
        granularity: "seconds"
    }
});
/**
 * The model for the role schema
 */
// const Role = model("Role", RoleSchema);
/**
 * Creates the `Role` model using the given connection.
 * @param {import("mongoose").Connection} c The connection from which to create the model.
 * @returns {import("mongoose").Model<RoleSchemaConfig>} the `Role` model created from the specified connection.
 */
const create = c => c.model("Role", RoleSchema);

module.exports = {
    RoleSchema, create
}
