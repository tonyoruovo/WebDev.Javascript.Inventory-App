// const {createSecretKey} = require("node:crypto");
const { run } = require("../controllers/cmd.cjs");
/**
 * Multiple routes that are logically related to user and admin accounts
 */
const router = require("express").Router();

router.route("/run").post(require("../controllers/middlewares/admin.cjs"), run);

module.exports = router;
