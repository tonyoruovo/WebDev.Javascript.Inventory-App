
/**
 * Decodes a url upon interception
 * @type {import("./d.cjs").Middleware}
 */
const decode = function(req, res, next) {
    // console.log({before: req.url});
    // req.url = req.url[0] + Buffer.from(req.url.substring(1), "base64").toString("utf-8");
    // console.log({after: req.url});
    console.log(req.query)
    console.log(req.body)
    next();
}

module.exports = decode
