const { get, remove, post, update } = require("../controllers/address.cjs");
const auth = require("../controllers/middlewares/auth.cjs");
/**
 * Multiple routes that are logically related to address data
 */
const router = require("express").Router();

router.route("/:id").get(get);
router.route("/put").put(auth, update);
router.route("/add").post(auth, post);
router.route("/delete").delete(auth, remove);

module.exports = router;
