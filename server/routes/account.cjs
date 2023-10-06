// const {createSecretKey} = require("node:crypto");
const {getAccount} = require("../controllers/account.cjs");
/**
 * Multiple routes that are logically related to user and admin accounts
 */
const router = require("express").Router();

router.route("/").get(getAccount);

module.exports = router;
