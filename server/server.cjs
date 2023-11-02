const c = require("../config.json");
const mongoose = require("mongoose");
const { e404, handler } = require("./controllers/middlewares/error.cjs");
const bodyParser = require("body-parser");
const { v } = require("./repos/utility.cjs");
const morgan = require("morgan");
const { createWriteStream } = require("fs");
const {join} = require("path");

/**
 * An object that retains a reference of the current session.
 * @typedef {Object} DbObject
 * @property {mongoose.Connection} [con] the mongoose connection.
 * @property {string} [n] the name of the model that created {@linkcode DbObject.s}, i.e the name of the mongodb collection that created.
 * @property {mongoose.mongo.ClientSession} [s] the session object created for this object.
 * @property {() => boolean} is checks if this has a valid session.
 * @property {() => boolean} ic checks if this has a valid connection to a database instance.
 * @property {() => Promise<void>} end checks if this has a valid session.
 */
/**
 * @typedef {Object} OperationModel
 * @property {string}
 */
/**
 * An object for tracking models during a complex insert operation. For example: to insert data into the `Employee` model, one has
 * to have an id for the `Subject` model, to have an id for a subject, one has to have an id for the `Contact` model, to have an id
 * for the contact, one has to have an id for the following:
 * - a `Name` model
 * - an `Account` model
 * - an `Address` model
 * - a `Phone` model
 * 
 * `Account` and `Address` models have also complex data structure that require ids and so on. To mitigate accidentally inserting
 * 'incomplete' data for any model, an `Operation` object is required by the server, which will verify the type of operation that
 * will be performed. An `Operation` can be ended, or aborted. All operations are time-sensitive and will auto-abort after an
 * elapsed time.
 * @typedef {Object} Operation
 * @property {number} time the start time of this operation
 * @property {() => Promise<void>} save saves the all models associated with this `Operation`. If there is an any of the models cannot
 * be saved (maybe due to an imcompatible property) all models will not be saved. This prevents a suituation whereby there is 'dangling'
 * data on the db. E.g an `Email` model without an `Account` model that directly owns it.
 * @property
 */

module.exports = () => {
    
    // mongoose.set("toJSON", { getters: true });
    mongoose.set("autoIndex", !c.inDev);
    mongoose.set("debug", c.inDev);

    /**
     * @type {DbObject}
     */
    let mog = {
        ic: () => v(mog.con),
        is: () => v(mog.n),
        end: async () => {
            await mog.con.close();
            await mog.s.endSession();
            mog.s = undefined;
            mog.n = undefined;
        }
    }
    
    const app = require("express")();
    
    // app.use(require("./controllers/middlewares/decode.cjs"));
    
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use(bodyParser.raw());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(morgan("combined", {
        stream: createWriteStream(join(__dirname, 'access.log'), { flags: 'a' })
    }));
    app.use("/api/v1/account", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/account.cjs"));
    app.use("/api/v1/address", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/address.cjs"));
    app.use("/api/v1/alert", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/alert.cjs"));
    app.use("/api/v1/amount", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/amount.cjs"));
    app.use("/api/v1/cmd", require("./routes/cmd.cjs"));
    app.use("/api/v1/contact", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/contact.cjs"));
    app.use("/api/v1/email", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/email.cjs"));
    app.use("/api/v1/employee", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/employee.cjs"));
    app.use("/api/v1/location", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/location.cjs"));
    app.use("/api/v1/name", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/name.cjs"));
    app.use("/api/v1/order", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/order.cjs"));
    app.use("/api/v1/paymentTerm", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/paymentTerm.cjs"));
    app.use("/api/v1/phone", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/phone.cjs"));
    app.use("/api/v1/product", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/product.cjs"));
    app.use("/api/v1/report", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/report.cjs"));
    app.use("/api/v1/subject", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/subject.cjs"));
    app.use("/api/v1/transaction", require("./controllers/middlewares/dbInit.cjs")(mog), require("./routes/transaction.cjs"));
    app.use(e404);
    app.use(handler)
    
    app.listen(7070, () => {
        console.log(`\u20AF: "Hello world! Jesus Christ is my Lord".
    listening on http://localhost:7070/`);
    console.log("connected!");
    });
}