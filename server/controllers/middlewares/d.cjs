/**
 * @module middlewares declaration of this folder
 */

/**
 * **SUMMARY**\
 * \
 * A functor (no-name interface with nameless method(s)) that is used in express as a middleware.
 * \
 * \
 * **DESCRIPTION**\
 * \
 * Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured
 * values are populated in the `req.params` object, with the name of the route parameter specified in the path as their respective keys.
 * ```txt
 * Route path: /users/:userId/books/:bookId
 * Request URL: http://localhost:3000/users/34/books/8989
 * req.params: { "userId": "34", "bookId": "8989" }
 * ```
 * To define routes with route parameters, simply specify the route parameters in the path of the route as shown below.
 * ```js
 * app.get('/users/:userId/books/:bookId', (req, res) => {
 *   res.send(req.params)
 * })
 * ```
 * The name of route parameters must be made up of “word characters” (`[A-Za-z0-9_]`).
 * Since the hyphen (-) and the dot (.) are interpreted literally, they can be used along with route parameters for useful purposes.
 * ```txt
 * Route path: /flights/:from-:to
 * Request URL: http://localhost:3000/flights/LAX-SFO
 * req.params: { "from": "LAX", "to": "SFO" }
 * Route path: /plantae/:genus.:species
 * Request URL: http://localhost:3000/plantae/Prunus.persica
 * req.params: { "genus": "Prunus", "species": "persica" }
 * ```
 * To have more control over the exact string that can be matched by a route parameter, you can append a regular expression in
 * parentheses (()):
 * ```txt
 * Route path: /user/:userId(\d+)
 * Request URL: http://localhost:3000/user/42
 * req.params: {"userId": "42"}
 * ```
 * Because the regular expression is usually part of a literal string, be sure to escape any \ characters with an additional backslash,
 * for example \\d+.
 * In Express 4.x, the * character in regular expressions is not interpreted in the usual way. As a workaround, use {0,} instead of *.
 * This will likely be fixed in Express 5.
 * @template {Record<string, string | number | bigint>} P the type of route params as a js object where the property name map to the parameter names.
 * @template RQ the type of request body.
 * @template RS the type of response body.
 * @template QS the type of schema for the query string.
 * @callback Middleware
 * @param {import("express").Request<P, RS, RQ, QS, unknown>} req the request made to this server
 * @param {import("express").Response<P, RS, RQ, QS, unknown>} res res The response from this server
 * @param {import("express").NextFunction} next the the next middleware in the chain
 * @returns {void} returns nothing
 */