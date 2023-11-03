const { get, init, start, commit, dlt, post, put, abort, stop } = require("../controllers/employee.cjs");
const auth = require("../controllers/middlewares/auth.cjs");
/**
 * Multiple routes that are logically related to employee data
 */
const router = require("express").Router();

router.route("/:id").get(auth, get);
router.route("/init").post(init);
router.route("/start").post(start);
router.route("/commit").post(commit);
router.route("/abort").post(abort);
router.route("/end").post(stop);
router.route("/put").put(auth, put);
router.route("/add").post(auth, post);
router.route("/delete").delete(auth, dlt);

module.exports = router;
