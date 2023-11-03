const { get, remove, post, update } = require("../controllers/contact.cjs");
const auth = require("../controllers/middlewares/auth.cjs");
/**
 * Multiple routes that are logically related to contact data
 */
const router = require("express").Router();

router.route("/:id").get(auth, get);
router.route("/put").put(auth, update);
router.route("/add").post(auth, post);
router.route("/delete").delete(auth, remove);

module.exports = router;
