const {Schema, model} = require("mongoose");
const { Amount } = require("./amount.cjs");
const { v } = require("../repo/utility.cjs");

/**
 * In the context of a "Supplier Model" in an inventory management system, "Payment terms" refer to the agreed-upon conditions and
 * timeframes under which payments for goods or services provided by the supplier are expected to be made by the purchasing
 * . Payment terms are a critical aspect of supplier relationships and procurement processes, as they outline the financial
 *  and expectations between the buyer (the organization) and the supplier.
 * Here's a more detailed explanation of what "Payment terms" typically entail:
 * 1. **Payment Period**: This specifies the duration within which the buyer is expected to make payment to the supplier. Common
 * payment periods include:
 *    - **Net 30**: Payment is due 30 days from the date of the invoice.
 *    - **Net 60**: Payment is due 60 days from the date of the invoice.
 *    - **Net 90**: Payment is due 90 days from the date of the invoice.
 *    - **Upon Receipt**: Payment is expected immediately upon receipt of the goods or services.
 * 2. **Discounts**: Payment terms often include provisions for early payment discounts, which provide an incentive for the buyer
 * to pay the invoice sooner. For example:
 *    - "2/10, Net 30" means the buyer can take a 2% discount if they pay within 10 days; otherwise, the full amount is due in 30
 * days.
 * 3. **Late Payment Penalties**: Payment terms may specify penalties or interest charges for payments made after the due date. This
 * encourages timely payments and compensates the supplier for delayed funds.
 * 4. **Payment Method**: The agreed-upon method of payment is mentioned in payment terms. It could be through checks, electronic
 * funds transfer (EFT), wire transfer, credit card, or other payment mechanisms.
 * 5. **Currency**: Payment terms also specify the currency in which payments should be made, especially relevant for international
 * transactions involving multiple currencies.
 * 6. **Credit Limit**: For ongoing supplier relationships, payment terms may be influenced by the creditworthiness of the
 * buyer. The payment terms could be more favorable for buyers with a good credit history.
 * 7. **Invoice Details**: Payment terms may include specific instructions regarding how invoices should be submitted, such as
 * the format, contact information, and any required references or purchase order numbers.
 * 8. **Negotiation**: Payment terms are often subject to negotiation between the buyer and the supplier. Both parties may agree
 * on terms that align with their financial needs and capabilities.
 * Payment terms in the "Supplier Model" serve several important purposes:
 * - **Financial Planning**: They help the buyer plan their cash flow and budgeting, as they know when payments will be due and
 * if any discounts apply.
 * - **Supplier Relationship Management**: Clear and mutually agreed-upon payment terms contribute to healthy and transparent supplier
 * relationships.
 * - **Risk Management**: Payment terms can influence the financial risk associated with procurement. Longer payment terms may
 * provide more time to generate revenue before payments are due, while shorter terms may be preferred for better discounts.
 * - **Compliance**: Adhering to payment terms ensures that the organization complies with its financial commitments and obligations
 * to suppliers.
 * - **Efficiency**: Clearly defined terms reduce misunderstandings and disputes regarding payments.
 * It's essential for organizations to manage payment terms effectively to maintain strong supplier relationships, optimize cash
 * flow, and ensure timely and accurate financial transactions. Additionally, payment terms should be recorded and tracked within
 * the inventory management system to facilitate accurate financial and procurement management.
 * @typedef {Object} PaymentTermSchemaConfig
 * @property {Schema.Types.ObjectId} _id The mongoose id.
 * @property {import("../data/d.cjs").Options<Schema.Types.Number, PaymentTermSchemaConfig>} _prd the payment period. The alias is `period`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, PaymentTermSchemaConfig>} _it the payment period interval. The alias is `interval`.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, PaymentTermSchemaConfig>} _tc the terms and conditions of the
 * payment period interval. The alias is `tAndC`. This includes when the payment method is specified as `others`, as it is expected
 * that the details are given here.
 * @property {import("../data/d.cjs").Options<[Schema.Types.ObjectId], PaymentTermSchemaConfig>} _a amounts. This includes base cost/bill
 * and any additional fees, taxes, charges and/or discounts. The alias is `amounts`. This is for suppliers and not for casual customers.
 * @property {import("../data/d.cjs").Options<Schema.Types.String, PaymentTermSchemaConfig>} _ty the payment type. The alias is
 * `paymentType`. Includes `cheque`, `check`, `cash`, `wire`, `credit`, `etf` (`paypal`, `verve`, `interswitch`, `crypto` etc).
 * @property {import("../data/d.cjs").Options<[Schema.Types.String], PaymentTermSchemaConfig>} _ic important codes and numbers related
 * to this payment term, for example account numbers, transfer tokens, wallet ids etc. The alias is `paymentCodes`.
 */
/**
 * @type {PaymentTermSchemaConfig}
 */
const paymentTerm = {
    _id: Schema.Types.ObjectId,
    _prd: {
        type: Schema.Types.Number,
        min: 0,
        required: true,
        alias: "period",
        default: 1
    },
    _it: {
        type: Schema.Types.String,
        enum: ["second", "minute", "hour", "day", "week", "month", "year", "decade"],
        alias: "interval",
        default: "day"
    },
    _tc: {
        type: Schema.Types.String,
        alias: "tAndC",
        required: true
    },
    _a: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Amount",
            validate: {
                validator: async function(x) {
                    return v(await Amount.findById(x).exec());
                },
                message: function(x) {
                    return `${x} does not exists as an amount`;
                }
            }
        }],
        alias: "amounts"
    },
    _ty: {
        type: Schema.Types.String,
        enum: ["cheque", "check", "cash", "wire", "credit", "etf"],
        alias: "paymentType",
        required: true
    },
    _ic: {
        type: [Schema.Types.String],
        alias: "paymentCodes",
        required: function(){
            return this._ty !== "cash";
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
 * @type {Schema<PaymentTermSchemaConfig>}
 */
const PaymentTermSchema = new Schema(paymentTerm, {
    timestamps: {
        createdAt: "_cAt",
        updatedAt: "_uAt"
    },
    versionKey: "_vk"
});
/**
 * The model for the payment term
 * @type {import("mongoose").Model<PaymentTermSchemaConfig>}
 */
const PaymentTerm = model("PaymentTerm", PaymentTermSchema);

module.exports = {
    PaymentTerm, PaymentTermSchema
}

