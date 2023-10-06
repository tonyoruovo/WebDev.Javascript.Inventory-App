/* eslint-disable one-var */
/**
 * Error middleware for when route was not found. It instantiates an `Error` object with a `404 Not found` message,
 * attaches a `statusCode` field to it, assigns `404` to that field and calls `next(err)`
 * @type {import("../middlewares/d.cjs").Middleware}
 */
const e404 = function (req, res, next) {
  const e = Error("Error 404. Not found");
  e.statusCode = 404;
  next(e);
};
/**
 * Error handler for when an uncaught error is thrown. It instantiates an `Error` object with a `500. A server error occurred.
 * That's all we know` message, attaches a `statusCode` field to it, assigns `500` to that field and calls `next(err)`
 * @type {import("../middlewares/d.cjs").Middleware}
 */
const e500 = function (req, res, next) {
  const e = Error("Error 500. A server error occurred. That's all we know");
  e.statusCode = 500;
  next(e);
};
/**
 * Error handler for when an uncaught error is thrown. It instantiates an `Error` object with a `400. Bad Request` message,
 * attaches a `statusCode` field to it, assigns `400` to that field and calls `next(err)`
 * @type {import("../middlewares/d.cjs").Middleware}
 */
const e400 = function (req, res, next) {
  const e = Error("Error 400. Bad Request");
  e.statusCode = 400;
  next(e);
};
/**
 * Error handler for when an uncaught error is thrown. It instantiates an `Error` object with a `401. Not Authorized` message,
 * attaches a `statusCode` field to it, assigns `401` to that field and calls `next(err)`
 * @type {import("../middlewares/d.cjs").Middleware}
 */
const e401 = function (req, res, next) {
  const e = Error("Error 401. Not Authorized");
  e.statusCode = 401;
  next(e);
};

/**
 * Adds a statusCode field to the error object with a value of `400` and throws the error
 * @type {import("express").Errback}
 * @throws {Error} when this function returns
 */
const badReq = function (err) {
  err.statusCode = 400;
  throw err;
};

/**
 * Adds a statusCode field to the error object with a value of `401` and throws the error
 * @type {import("express").Errback}
 * @throws {Error} when this function returns
 */
const nAuth = function (err) {
  err.statusCode = 401;
  throw err;
};
/**
 * Default error handler that properly assigns the response status as well as the stack message for debugging
 * @type {import("express").ErrorRequestHandler}
 */
const handler = function (er, req, res, next) {
  if (er) {
    console.log("an error occured");
    console.log(er);
    const c = require("../../../config.json");
    if(c.inDev)
      res.status(er.statusCode ? er.statusCode : 500).json({
        message: er.message ?? "internal server error",
        stack: er.stack,
      });
    else res.status(er.statusCode ? er.statusCode : 500);
  }
  return next();
};

module.exports = {
  e400,
  e401,
  e404,
  e500,
  badReq,
  nAuth,
  handler,
};
