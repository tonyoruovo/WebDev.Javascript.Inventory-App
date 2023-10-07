
const { Schema, model } = require("mongoose");

/**
 * @typedef {Object} ReportSchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id for this report.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ReportSchemaConfig>} _m any message related to this report. The
 * alias is `message`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, ReportSchemaConfig>} _t the type of report. valid values are
 * `inventory-status`, `sales`, `purchases`, `financial`, `inventory-valuation`, `stock-reorder`, `product-movement`,
 * `custom-report`. The alias is `reportType`.\
 * \
 * In the context of the "Report Model" within an inventory management system, the "Type" attribute typically refers to the
 * categorization or classification of reports based on their nature or purpose. The "Type" property helps differentiate different
 * types of reports, making it easier for users to identify the kind of information or analysis provided by a particular report.
 * Here's a more detailed explanation of the "Type" attribute in the Report Model:
 * 1. **Types of Reports**:
 *    - The "Type" property can take on various values, each representing a specific type of report. These values are typically defined
 *    based on the needs of the inventory management system. Common types of reports may include:
 *      - **Inventory Status Report**: Provides an overview of the current status of inventory items, including quantities on hand,
 *      locations, and stock levels.
 *      - **Sales Report**: Offers insights into sales performance, including sales revenue, product sales trends, and customer
 *      purchasing behavior.
 *      - **Purchase Report**: Focuses on procurement and supplier-related data, including purchase orders, supplier performance, and
 *      procurement costs.
 *      - **Financial Report**: Includes financial data such as profit and loss statements, balance sheets, and cash flow reports
 *      related to inventory and sales.
 *      - **Inventory Valuation Report**: Calculates the value of inventory based on various methods (e.g., FIFO, LIFO) and accounting
 *      principles.
 *      - **Stock Reorder Report**: Assists in managing inventory replenishment by identifying items that have reached a reorder point.
 *           - **Product Movement Report**: Tracks the movement of products in and out of inventory locations, aiding in demand forecasting
 *      and optimization.
 *      - **Custom Reports**: Organizations can define custom report types to address specific reporting needs or to cater to unique
 *      business processes.
 * 2. **Contextual Information**:
 *    - The "Type" attribute provides essential context for each report. It helps users understand the purpose and content of the report
 *    and why it is being generated.
 *    - For example, a "Sales Report" type indicates that the report provides insights into sales-related data, while an "Inventory
 *    Valuation Report" type signifies a focus on inventory accounting and valuation.
 * 3. **Filtering and Selection**:
 *    - Users can filter and select reports based on their type, making it easier to find the specific report they need among a
 *    potentially extensive list of reports.
 *    - The "Type" property allows users to narrow down their choices and access reports that are relevant to their current tasks or
 *    objectives.
 * 4. **Access Control**:
 *    - Access control and permissions can be tied to the "Type" property, ensuring that users can only access reports that are relevant to
 *    their roles and responsibilities.
 *    - For instance, financial reports may be restricted to finance and management personnel, while inventory status reports may be
 *    accessible to warehouse and inventory managers.
 * 5. **Customization**:
 *    - Organizations have the flexibility to define and customize report types to match their unique reporting requirements and
 *    industry-specific needs.
 *    - Custom report types can accommodate specialized analytics, compliance reporting, or other specific business objectives.
 * In summary, the "Type" attribute in the Report Model serves as a fundamental component for categorizing and organizing reports within
 * the inventory management system. It provides clarity, context, and user-friendly navigation, enabling users to efficiently access and
 * utilize reports to make informed decisions, track performance, and optimize inventory management processes.
 * @property {import("../data/d.cjs").Options<[Schema.Types.Mixed], ReportSchemaConfig>} _pf the parameters and filters of this
 * report. This is an object such as:
 * ```js
 * {
 *     modelName: "name of the collection",
 *     path: ["array", "of", "path", "to", "specific", "properties", "to", "include"]
 * }
 * ```
 * Has no alias.
 */
/**
 * @type {ReportSchemaConfig}
 */
const report = {
    _id: Schema.Types.ObjectId,
    _m: {
        type: Schema.Types.String,
        trim: true,
        alias: "message"
    },
    _pf: {
        type: [{
            type: Schema.Types.String,
            validate: {
                validator: function(x) {
                    return x.indexOf(".") < 0;
                },
                message: function(x){
                    return 'cannot have a "." in any path';
                }
            },
            _id: false,
            trim: true,
        }],
        required: true
    },
    _t: {
        type: Schema.Types.String,
        required: true,
        alias: "reportType",
        enum: ["inventory-status", "sales", "purchases", "financial", "inventory-valuation", "stock-reorder", "product-movement", "custom-report"]
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
const ReportSchema = new Schema(report, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});

/**
 * The model for the report
 */
const Report = model("Report", ReportSchema);

module.exports = {
    Report, ReportSchema
}