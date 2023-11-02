const {
	get,
	remove,
	post,
	update,
	signin
} = require("../controllers/account.cjs");
const auth = require("../controllers/middlewares/auth.cjs");
/**
 * Multiple routes that are logically related to account data
 */
const router = require("express").Router();

router.route("/:id").get(auth, get);
router.route("/put").put(auth, update);
router.route("/add").post(post);
router.route("/delete").delete(auth, remove);

router.route("/signin").post(signin);
// router.route("/signout").post(signout);

module.exports = router;
