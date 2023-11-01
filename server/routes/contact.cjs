const { get, remove, post, update } = require("../controllers/contact.cjs");
/**
 * Multiple routes that are logically related to contact data
 */
const router = require("express").Router();

router.route("/:id").get(get);
router.route("/put").put(update);
router.route("/add").post(post);
router.route("/delete").delete(remove);

module.exports = router;
