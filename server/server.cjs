const c = require("../config.json");
const { default: mongoose } = require("mongoose");
const { e404, handler } = require("./controllers/middlewares/error.cjs");
const bodyParser = require("body-parser");
const { v } = require("./repos/utility.cjs");

/**
 * An object that retains a reference of the current session.
 * @typedef {Object} DbSession
 * @property {mongoose.mongo.Db} [db] the database connection.
 * @property {string} [n] the name of the model that created {@linkcode DbSession.s}, i.e the name of the mongodb collection that created.
 * @property {mongoose.mongo.ClientSession} [s] the session object created for this object.
 * @property {() => boolean} is checks if this has a valid session.
 * @property {() => boolean} ic checks if this has a valid connection to a database instance.
 * @property {() => Promise<void>} end checks if this has a valid session.
 */

module.exports = () => {
    
    // mongoose.set("toJSON", { getters: true });
    mongoose.set("autoIndex", !c.inDev);
    mongoose.set("debug", c.inDev);

    /**
     * @type {DbSession}
     */
    let mog = {
        ic: () => v(mog.db),
        is: () => v(mog.n),
        end: async () => {
            await mog.s.endSession();
            mog.n = undefined;
        }
    }
    
    const app = require("express")();
    
    // app.use(require("./controllers/middlewares/decode.cjs"));
    
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use(bodyParser.raw());
    app.use(bodyParser.urlencoded());
    app.use("/api/v1/account", require("./routes/account.cjs"));
    app.use("/api/v1/cmd", require("./routes/cmd.cjs"));
    app.use(e404);
    app.use(handler)
    
    app.listen(7070, () => {
        console.log(`\u20AF: "Hello world! Jesus Christ is my Lord".
    listening on http://localhost:7070/`);
    console.log("connected!");
    });
}