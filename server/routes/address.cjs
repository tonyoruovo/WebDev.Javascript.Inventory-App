const { get, remove, post, update } = require("../controllers/address.cjs");
/**
 * Multiple routes that are logically related to address data
 */
const router = require("express").Router();

router.route("/:id").get(get);
router.route("/put").put(update);
router.route("/add").post(post);
router.route("/delete").delete(remove);

module.exports = router;
