const { get, remove, post, update } = require("../controllers/transaction.cjs");
/**
 * Multiple routes that are logically related to transaction data
 */
const router = require("express").Router();

router.route("/:id").get(get);
router.route("/put").put(update);
router.route("/add").post(post);
router.route("/delete").delete(remove);

module.exports = router;
