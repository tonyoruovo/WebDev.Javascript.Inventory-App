const { get, remove, post, update, signin, signout } = require("../controllers/account.cjs");
/**
 * Multiple routes that are logically related to account data
 */
const router = require("express").Router();

router.route("/:id").get(get);
router.route("/put").put(update);
router.route("/add").post(post);
router.route("/delete").delete(remove);

router.route("/signin").post(signin);
router.route("/signout").post(signout);

module.exports = router;
