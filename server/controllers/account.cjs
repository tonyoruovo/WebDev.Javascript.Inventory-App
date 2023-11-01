// const asyncHandler = require("express-async-handler");
// http://localhost:7070/YXBpL3YxL2FjY291bnQ/bmFtZT10b255JnRpbWU9MTIzNDA5ODc=
// const getAccount = asyncHandler(async function(req, res) {
//     res.status(200).json({
//         url: req.url,
//         "encoded (base64)": Buffer.from(req.originalUrl.substring(1), "utf-8").toString("base64"),
//         "encoded (base64 url)": Buffer.from(req.originalUrl.substring(1), "utf-8").toString("base64url"),
//         "encodeURI": encodeURI(`http://localhost:7070${req.originalUrl}`),
//         baseUrl: req.baseUrl,
//         originalUrl: req.originalUrl,
//         query: req.query,
//         params: req.params,
//         headers: req.headers,
//         body: req.body,
//         httpVersion: req.httpVersion,
//         httpVersionMinor: req.httpVersionMinor,
//         httpVersionMajor: req.httpVersionMajor,
//         username: "username",
//         password: "password",
//     });
// });
// module.exports = {
//     getAccount
// }
const asyncHandler = require("express-async-handler");
const { throws } = require("./middlewares/error.cjs");
const {add, mod, ret, rem, login, logout} = require("../data/account.cjs");
const { Types } = require("mongoose");

const signout = asyncHandler(async function(rq, rs) {
    try {
        rs.status(200).json(await logout({
            _id: new Types.ObjectId(rq.params.id)
        }));
    } catch (e) {
        throws(e, "Not Found. The resource requested was unavailable", 404);
    }
});

const signin = asyncHandler(async function(rq, rs) {
    try {
        const e = await login({})
        rs.status(200).json(await login({
            _id: new Types.ObjectId(rq.params.id),
        }));
    } catch (e) {
        throws(e, "Not Found. The resource requested was unavailable", 404);
    }
});

const get = asyncHandler(async function(rq, rs) {
    try {
        rs.status(200).json(await ret({
            _id: new Types.ObjectId(rq.params.id)
        }));
    } catch (e) {
        throws(e, "Not Found. The resource requested was unavailable", 404);
    }
});
const post = asyncHandler(async function(rq, rs) {
    try {
        const e = await add(rq.body);
        return rs.status(201).json(e);
    } catch (e) {
        throws(e, "Forbidden. Invalid action", 403);
    }
});
const update = asyncHandler(async function(rq, rs) {
    try {
        await mod(rq.body);
        return rs.status(204);
    } catch (e) {
        throws(e, "Forbidden. Invalid action", 403);
    }
});
const remove = asyncHandler(async function(rq, rs) {
    try {
        await rem(rq.body);
        return rs.status(204);
    } catch (e) {
        throws(e, "Not Found. The resource requested was unavailable", 404);
    }
});

module.exports = {
    get, post, update, remove, signin, signout
}
