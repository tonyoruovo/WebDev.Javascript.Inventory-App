
const { Schema } = require("mongoose");
const { v } = require("../repo/utility.cjs");

/**
 * Combining the "Purchase Order Model" and the "Sales Order Model" into a single "Order Model" while merging the "status" property
 * can be achieved by creating a unified model that accounts for both purchase and sales orders. Here's an example of how you can merge
 * these models and create a consolidated "status" property:
 * **Order Model**:
 * - **Order ID**: A unique identifier for the order.
 * - **Order Type**: Indicates whether the order is a "Purchase Order" or a "Sales Order."
 * - **Customer/Supplier**: References the customer or supplier associated with the order.
 * - **Order Date**: The date when the order was created.
 * - **Expected Delivery Date**: The expected date of delivery for the order.
 * - **Order Items**: A list of items included in the order, each with details like product, quantity, and price.
 * - **Total Amount**: The total monetary value of the order.
 * - **Status**: A combined "Status" property that reflects both purchase and sales order statuses.\
 * \
 * **Combined Status Property**:
 * The "Status" property in the unified "Order Model" can be a combination of statuses from both the "Purchase Order Model" and the
 * "Sales Order Model." Here's an example of how you can structure this combined status:
 * - **Common Statuses** (Applicable to Both Purchase and Sales Orders):
 *    - **Pending**: The order has been created but has not yet been processed or approved.
 *    - **Approved**: The order has been reviewed and approved, and it is ready for further processing.
 *    - **In Progress**: The order is currently in the process of being fulfilled, which may include tasks like order preparation,
 *    communication with suppliers or customers, and shipment coordination.
 *    - **Completed**: The entire order process, including delivery and any necessary payments, has been successfully completed.
 *    - **Canceled**: The order has been canceled, either by request or due to unforeseen circumstances.
 * - **Purchase Order-Specific Statuses**:
 *    - **Received**: Indicates that the items specified in the purchase order have been received in the inventory.
 * - **Sales Order-Specific Statuses**:
 *    - **Shipped**: Indicates that the items specified in the sales order have been shipped to the customer.
 * By combining the statuses from both purchase and sales orders into a single "Status" property, you provide a unified view of the
 * status of orders in the system. This approach simplifies order tracking and management, as you can use a consistent set of statuses
 * for both purchase and sales order processes. Users can easily discern the current state of any order, whether it's related to procurement
 * or sales, within the same system.
 * @typedef {Object} OrderSchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id for this order.
 * @property {import("../data/d.cjs").Options<Schema.Types.ObjectId, OrderSchemaConfig>} _s the subject that made this order. This may be an employee (purchases, transfers, adjustments etc) or cutomer (sales).
 * @property {import("../data/d.cjs").Options<Schema.Types.String, OrderSchemaConfig>} _ot the type of order. The alias `orderType`.\
 * \
 * In the context of the "Inventory Transaction Model" within an inventory management system, the "Type" property typically refers
 * to a categorization or classification of the inventory transaction. This "Type" attribute helps specify the nature or purpose of the
 * transaction, providing additional context to understand what occurred during the inventory-related operation. Here's a more detailed
 * explanation of the "Type" property in the Inventory Transaction Model:
 * 1. **Transaction Types**:
 *    - The "Type" property can take on various values, each representing a specific type of inventory-related operation or transaction.
 *    These values are typically defined based on the needs of the inventory management system. Common transaction types may include:
 *      - **Purchase**: Indicates that new inventory items or stock have been acquired through a purchase order.
 *      - **Sale**: Represents the sale of products to customers or clients.
 *      - **Transfer**: Denotes the movement of inventory items from one location to another within the organization's facilities.
 *      - **Adjustment**: Refers to manual adjustments made to the inventory levels, often for reasons like damaged goods, shrinkage,
 *      or inventory discrepancies.
 *      - **Return**: Indicates the return of products by customers, suppliers, or employees.
 *      - **Consumption**: Used for recording the usage or consumption of inventory items for internal purposes, such as manufacturing
 *      or internal projects.
 *      - **Waste/Disposal**: Marks the disposal or write-off of damaged or obsolete inventory items.
 *      - **Replenishment**: Represents the replenishment of stock to maintain desired inventory levels.
 *      - **Reserve**: Used for reserving a portion of inventory for specific purposes, such as pre-orders or future sales.
 *      - **Count**: Indicates inventory counting or auditing activities.
 *      - **Cycle Count**: Refers to a periodic inventory counting method that involves counting a subset of items at regular intervals.
 *      - **Stock Adjustment**: Represents adjustments made to stock levels for reasons other than damage or shrinkage.
 *      - **Kitting/Assembly**: Denotes the assembly or kitting of products from individual components or parts.
 * 2. **Contextual Information**:
 *    - The "Type" attribute provides valuable context for each inventory transaction. It helps users understand why the transaction
 *    occurred and what impact it has on inventory levels and financial records.
 *    - For reporting and analysis purposes, the "Type" property allows users to filter and group transactions based on their nature,
 *    making it easier to track and analyze inventory movements and trends.
 * 3. **Workflow and Automation**:
 *    - Inventory management systems can use the "Type" property to trigger specific workflows or automation rules. For example, a
 *    "Purchase" transaction type may initiate processes related to supplier payments and order fulfillment, while a "Sale" transaction
 *    may trigger inventory updates and customer invoicing.
 * 4. **Integration and Reporting**:
 *    - The "Type" attribute is essential for integration with other business systems and for generating accurate inventory reports.
 *    It helps ensure that transactions are categorized correctly and aligned with accounting and financial systems.
 * 5. **Auditing and Compliance**:
 *    - Having a clear and standardized set of transaction types assists in auditing and compliance efforts, ensuring that inventory
 *    transactions are appropriately documented and categorized for regulatory and financial reporting requirements.
 * In summary, the "Type" property in the Inventory Transaction Model serves as a fundamental component for classifying and categorizing
 * various inventory-related activities. It plays a crucial role in providing context, managing workflows, facilitating reporting, and
 * ensuring accurate and compliant inventory management within the system.
 * @property {import("../data/d.cjs").Options<Schema.Types.Date, OrderSchemaConfig>} _d the expected delivery date for this order.
 * @property {import("../data/d.cjs").Options<[Schema.Types.ObjectId], OrderSchemaConfig>} _it the items specified for this order.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, OrderSchemaConfig>} _st the current status of this order. including
 * `pending`, `recieved`, `canceled`, `shipped`, `approved`, `in-progress`, `completed`, `failed`, `other`. When using `other`,
 * ensure further explanation is given on the comments property. The alias is `status`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, OrderSchemaConfig>} _c further comments, review or complaints. The
 * alias is `comment`.
 */
/**
 * @type {OrderSchemaConfig}
 */
const order = {
    _id: Schema.Types.ObjectId,
    _s: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        alias: "subject",
        validate: {
            validator: async function(x) {
                return v(await require("./subject.cjs").Subject.findById(x).exec());
            },
            message: function(x) {
                return `${x} does not exists`;
            }
        }
    },
    _d: {
        type: Schema.Types.Date,
        alias: "deliveryDate"
    },
    // _it: {
    //     type: [{
    //         type: {
    //             product: {
    //                 type: Schema.Types.ObjectId,
    //                 ref: "Product",
    //                 required: true
    //             },
    //             quantity: {
    //                 type: Schema.Types.Number,
    //                 required: true,
    //             },
    //         }
    //     }],
    //     alias: "items",
    //     required: true
    // },
    _it: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            validate: {
                validator: async function(x) {
                    return v(await require("./product.cjs").Product.findById(x).exec());
                },
                message: function(x) {
                    return `${x} does not exists as a product`;
                }
            }
        }],
        alias: "items",
        required: true
    },
    _ot: {
        type: Schema.Types.String,
        alias: "orderType",
        enum: ["adjustment", "assembly", "count", "cycle-count", "consumption", "kitting", "purchase", "replenishment", "reserve",
        "return", "sale", "transfer"]
    },
    _st: {
        type: Schema.Types.String,
        alias: "status",
        enum: [`pending`, `recieved`, `canceled`, `shipped`, `approved`, `in-progress`, `completed`, `failed`, 'other']
    },
    _c: {
        type: Schema.Types.ObjectId,
        alias: "comment"
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
 * @type {Schema<OrderSchemaConfig>}
 */
const OrderSchema = new Schema(order, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the order
 * @type {import("mongoose").Model<OrderSchemaConfig>}
 */
// const Order = model("Order", OrderSchema);
/**
 * Creates the `Order` model using the given connection.
 * @param {import("mongoose").Connection} c The connection from which to create the model.
 * @returns {import("mongoose").Model<OrderSchemaConfig>} the `Order` model created from the specified connection.
 */
const create = c => c.model("Order", OrderSchema);

module.exports = {
    create, OrderSchema
}
