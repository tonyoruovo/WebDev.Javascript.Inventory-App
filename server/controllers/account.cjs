const asyncHandler = require("express-async-handler");
// http://localhost:7070/YXBpL3YxL2FjY291bnQ/bmFtZT10b255JnRpbWU9MTIzNDA5ODc=
const getAccount = asyncHandler(async function(req, res) {
    res.status(200).json({
        url: req.url,
        "encoded (base64)": Buffer.from(req.originalUrl.substring(1), "utf-8").toString("base64"),
        "encoded (base64 url)": Buffer.from(req.originalUrl.substring(1), "utf-8").toString("base64url"),
        "encodeURI": encodeURI(`http://localhost:7070${req.originalUrl}`),
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl,
        query: req.query,
        params: req.params,
        headers: req.headers,
        body: req.body,
        httpVersion: req.httpVersion,
        httpVersionMinor: req.httpVersionMinor,
        httpVersionMajor: req.httpVersionMajor,
        username: "username",
        password: "password",
    });
});
module.exports = {
    getAccount
}
