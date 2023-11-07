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
const {add, mod, ret, rem, login} = require("../data/account.cjs");
const { Types } = require("mongoose");
/**
 * @typedef {import("../data/account.cjs").AccountDoc} PostBody
 * @typedef {import("../data/account.cjs").AccountRef} ResponseBody
 */

// const signout = asyncHandler(async function(rq, rs) {
//     try {
//         rs.status(200).json(await logout({
//             _id: new Types.ObjectId(rq.params.id)
//         }));
//     } catch (e) {
//         throws(e, "Not Found. The resource requested was unavailable", 404);
//     }
// });
/**
 * Logs a user in.
 * @method POST
 * @route /api/v1/transaction/signin
 * @type {import("./middlewares/d.cjs").Middleware<undefined, PostBody, ResponseBody, undefined>}
 */
const signin = asyncHandler(async function(rq, rs) {
    try {
        const e = await login(rq.body);
        /**@type {string[]} */
        let tkn;
        if(Array.isArray(e)){ tkn = e[0].tkn.split("."); e = e.map(x => {x.tkn = undefined; return x})}
        else { tkn = e.tkn.split("."); e.tkn = undefined;}

        rs.clearCookie("hp", {
            expires: new Date(Date.now() + 1_800_000),//Adds an extra 30 minutes
            maxAge: 1_8000_000,
            secure: true
        });
        //set a "hp" cookie for the `header.payload`
        rs.cookie("hp", `${tkn[0]}.${tkn[1]}`, {
            expires: new Date(Date.now() + 1_800_000),
            maxAge: 1_8000_000,
            secure: true
        })
        //set a 's' cookie for the `signature`
        .cookie("s", tkn[2], {
            expires: 0,
            httpOnly: true,
            secure: true
        });
        rs.status(200).json(e);
    } catch (e) {
        throws(e, "Not Found. The resource requested was unavailable", 404);
    }
});

const get = asyncHandler(async function(rq, rs) {
    try {
        const r = await ret({
            _id: new Types.ObjectId(rq.params.id)
        })
        rq.body.connection.close();
        rs.status(200).json(r);
    } catch (e) {
        throws(e, "Not Found. The resource requested was unavailable", 404);
    }
});
/**
 * Creates an account
 * @method POST
 * @route /api/v1/transaction/add
 * @type {import("./middlewares/d.cjs").Middleware<undefined, PostBody, ResponseBody & {tkn: undefined}, undefined>}
 */
const post = asyncHandler(async function(rq, rs) {
    try {
        const e = await add(rq.body);
        rq.body.connection.close();
        /**@type {string[]} */
        let tkn;
        if(Array.isArray(e)){ tkn = e[0].tkn.split("."); e = e.map(x => {x.tkn = undefined; return x})}
        else { tkn = e.tkn.split("."); e.tkn = undefined;}

        rs.clearCookie("hp", {
            expires: new Date(Date.now() + 1_800_000),//Adds an extra 30 minutes
            maxAge: 1_8000_000,
            secure: true
        });
        //set a "hp" cookie for the `header.payload`
        rs.cookie("hp", `${tkn[0]}.${tkn[1]}`, {
            expires: new Date(Date.now() + 1_800_000),
            maxAge: 1_8000_000,
            secure: true
        })
        //set a 's' cookie for the `signature`
        .cookie("s", tkn[2], {
            expires: 0,
            httpOnly: true,
            secure: true
        });
        return rs.status(201).json(e);
    } catch (e) {
        throws(e, "Forbidden. Invalid action", 403);
    }
});
const update = asyncHandler(async function(rq, rs) {
    try {
        await mod(rq.body);
        rq.body.connection.close();
        return rs.status(204);
    } catch (e) {
        throws(e, "Forbidden. Invalid action", 403);
    }
});
const remove = asyncHandler(async function(rq, rs) {
    try {
        await rem(rq.body);
        rq.body.connection.close();
        return rs.status(204);
    } catch (e) {
        throws(e, "Not Found. The resource requested was unavailable", 404);
    }
});

module.exports = {
    get, post, update, remove, signin
}
