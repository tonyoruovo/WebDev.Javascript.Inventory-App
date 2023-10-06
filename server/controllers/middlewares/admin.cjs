/**
 * @type {import("./d.cjs").Middleware}
 */
function connect(req, res, next) {
    if(req.body && req.body.connStr){
        const uri = `mongodb://${
            encodeURIComponent(req.body.connStr.user)
        }:${
            encodeURIComponent(req.body.connStr.pass)
        }@${req.body.connStr.host}:${req.body.connStr.port??27017}/?directConnection=${
            encodeURIComponent(req.body.connStr.directConnection??true)
        }&connectTimeoutMS=${
            encodeURIComponent(req.body.connStr.connectTimeoutMS??30_000)
        }&authSource=${
            encodeURIComponent(req.body.connStr.authSource??"admin")
        }&appName=${
            encodeURIComponent(req.body.connStr.appName??"inventory-server.js")
        }`;
        const options = { dbName: req.body.connStr.dbName??"inventory", serverApi: { version: req.body.connStr.ver??"1" } }
        req.body.connStr = {uri, options}
    }
    next();
}

module.exports = connect