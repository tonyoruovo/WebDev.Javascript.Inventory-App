
const { Schema } = require("mongoose");

/**
 * @typedef {Object} AlertSchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id for this alert.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AlertSchemaConfig>} _t the type of alert. The alias is `alertType`.
 * The enums are `low-stock`, `expiration`, `confirm`, `shipment`, `payment`, `error`, `security`, `other`.
 * Certainly, in the context of the "Alerts and Notifications Model" within an inventory management software, the "Type" attribute refers
 * to the categorization or classification of the alert or notification. This "Type" property is used to differentiate between different
 * types of alerts and notifications based on their nature or purpose. Here's a more detailed explanation of the "Type" attribute in the
 * Alerts and Notifications Model:
 * 1. **Types of Alerts and Notifications**:
 *    - The "Type" property can take on various values, each representing a specific type of alert or notification. These values are
 *    typically defined based on the needs of the inventory management system. Common types of alerts and notifications may include:
 *      - **Low Stock Alert**: Generated when the quantity of a product in stock falls below a predefined threshold, indicating the need
 *      to reorder.
 *      - **Expiration Alert**: Triggered when products with expiration dates are approaching or have reached their expiration dates,
 *      signaling the need to remove or use them.
 *      - **Order Confirmation**: Sent to confirm the successful placement of an order, providing details such as order number and
 *      expected delivery date.
 *      - **Shipment Notification**: Generated when products have been shipped to a customer, including tracking information.
 *      - **Payment Reminder**: Sent to remind customers of pending payments or overdue invoices.
 *      - **System Error Alert**: Issued when there is a critical error or issue within the inventory management system that requires
 *      immediate attention.
 *      - **Security Alert**: Generated in response to security-related events, such as unauthorized access attempts or suspicious
 *      activities.
 *      - **Custom Alerts**: Organizations can define custom alert types to address specific events or conditions that are relevant
 *      to their operations.
 * 2. **Contextual Information**:
 *    - The "Type" attribute provides essential context for each alert or notification. It helps users understand the nature and purpose
 *    of the notification and why it was generated.
 *    - For example, a "Low Stock Alert" type indicates that the alert is related to inventory replenishment, while an "Expiration Alert"
 *    type signals the need for product quality and safety management.
 * 3. **Filtering and Prioritization**:
 *    - Having a "Type" property allows users to filter and prioritize alerts and notifications based on their importance or relevance.
 *    Users can focus on addressing critical alerts first and filter out less urgent ones.
 * 4. **Workflow Automation**:
 *    - The "Type" attribute can be used to trigger specific workflow automation based on the type of alert or notification. For instance,
 *    a "Low Stock Alert" type might automatically generate a purchase order or alert the purchasing department.
 * 5. **Auditing and Reporting**:
 *    - Recording the "Type" of each alert or notification is essential for auditing and reporting purposes. It helps track the
 *    frequency and nature of alerts, enabling organizations to improve their processes and responses.
 * 6. **Customization**:
 *    - Organizations can customize the list of alert types to align with their specific inventory management needs and operational
 *    requirements. This flexibility allows for tailored alerting systems.
 * In summary, the "Type" attribute in the Alerts and Notifications Model plays a crucial role in categorizing and differentiating
 * various types of alerts and notifications within the inventory management system. It provides clarity, context, and organization
 * to the notification system, facilitating effective communication, decision-making, and action within the organization.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, AlertSchemaConfig>} _m the message (which may be json, xml, html,
 * markdown etc string). The alias is `message`.
 */
/**
 * @type {AlertSchemaConfig}
 */
const alert = {
    _id: Schema.Types.ObjectId,
    _t: {
        type: Schema.Types.String,
        required: true,
        alias: "alertType",
        enum: ["low-stock", "expiration", "confirm", "shipment", "payment", "error", "security", "other"]
    },
    _m: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        alias: "message"
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
 * @type {Schema<AlertSchemaConfig>}
 */
const AlertSchema = new Schema(alert, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the alert
 * @type {import("mongoose").Model<AlertSchemaConfig>}
 */
// const Alert = model("Alert", AlertSchema);
/**
 * Creates the `Alert` model using the given connection.
 * @param {import("mongoose").Connection} c The connection from which to create the model.
 * @returns {import("mongoose").Model<AlertSchemaConfig>} the `Alert` model created from the specified connection.
 */
const create = c => c.model("Alert", AlertSchema);

module.exports = {
    AlertSchema, create
}
