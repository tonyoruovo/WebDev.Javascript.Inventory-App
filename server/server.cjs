const c = require("../config.json");
const mongoose = require("mongoose");
const { e404, handler } = require("./controllers/middlewares/error.cjs");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { createWriteStream } = require("fs");
const {join} = require("path");
const { auto } = require("./controllers/middlewares/autoCon.cjs");
const cookieParser = require("cookie-parser");

/**
 * An object that retains a reference of the current session.
 * @typedef {Object} DbObject
 * @property {mongoose.Connection} [con] the mongoose connection.
 * @property {string} [n] the name of the model that created {@linkcode DbObject.s}, i.e the name of the mongodb collection that created.
 * @property {mongoose.mongo.ClientSession} [s] the session object created for this object.
 * @property {() => boolean} is checks if this has a valid session.
 * @property {() => boolean} ic checks if this has a valid connection to a database instance.
 * @property {() => Promise<void>} end checks if this has a valid session.
 * @property {mongoose.Connection} robCon Robot Connection. This the connection used for automatically generated data.
 */
module.exports = () => {
    
    // mongoose.set("toJSON", { getters: true });
    mongoose.set("autoIndex", !c.inDev);
    mongoose.set("debug", c.inDev);
    /*
     
    let mog = {
        ic: () => v(mog.con),
        is: () => v(mog.n),
        end: async () => {
            await mog.con.close();
            await mog.s.endSession();
            mog.s = undefined;
            mog.n = undefined;
        }
    }*/
    
    const app = require("express")();

    /*
    setInterval(async () => {
        const Report = require("./models/report.cjs").create();
        const r = await Report.create({
            _id: new mongoose.Types.ObjectId(),
            _m: "Auto generated monthly reports",
            _pf: [
                { modelName: "Transaction", path: ["_ta"] }
            ],
            _t: "sales"
        });
        r.save();
    }, (3_600_000 * 24) * 30)//every 30 days
    */

    app.use(bodyParser.json({limit: (1024 * 1024) * 5}));//5mb
    app.use(bodyParser.text());
    app.use(bodyParser.raw());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(morgan("combined", {
        stream: createWriteStream(join(__dirname, 'access.log'), { flags: 'a' })
    }));
    // app.use(morgan(c.inDev ? "dev" : "combined", {
    //     stream: createWriteStream(join(__dirname, 'access.log'), { flags: 'a' })
    // }));
    app.use(cookieParser());
    app.use("/api/v1/account", auto(), require("./routes/account.cjs"));
    app.use("/api/v1/address", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/address.cjs"));
    app.use("/api/v1/alert", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/alert.cjs"));
    app.use("/api/v1/amount", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/amount.cjs"));
    app.use("/api/v1/cmd", require("./routes/cmd.cjs"));
    app.use("/api/v1/contact", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/contact.cjs"));
    app.use("/api/v1/email", auto(), require("./routes/email.cjs"));
    app.use("/api/v1/employee", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/employee.cjs"));
    app.use("/api/v1/location", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/location.cjs"));
    app.use("/api/v1/name", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/name.cjs"));
    app.use("/api/v1/order", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/order.cjs"));
    app.use("/api/v1/paymentTerm", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/paymentTerm.cjs"));
    app.use("/api/v1/phone", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/phone.cjs"));
    app.use("/api/v1/product", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/product.cjs"));
    app.use("/api/v1/report", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/report.cjs"));
    app.use("/api/v1/subject", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/subject.cjs"));
    app.use("/api/v1/transaction", require("./controllers/middlewares/dbInit.cjs")(), require("./routes/transaction.cjs"));
    app.use(e404);
    app.use(handler);
    
    app.listen(7070, () => {
    //     console.log(`\u20AF: "Hello world! Jesus Christ is my Lord".
    // listening on http://localhost:7070/`);
    console.log("connected!");
    });
}