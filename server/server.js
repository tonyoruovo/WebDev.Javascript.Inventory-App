const c = require("../config.json");
const { default: mongoose } = require("mongoose");
const { e404, handler } = require("./controllers/middlewares/error.cjs");
const bodyParser = require("body-parser");

mongoose.set("toJSON", { getters: true });
mongoose.set("autoIndex", !c.inDev);
mongoose.set("debug", c.inDev);

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
