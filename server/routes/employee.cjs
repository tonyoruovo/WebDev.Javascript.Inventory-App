const { get, init, start, commit, dlt, post, put, abort, stop } = require("../controllers/employee.cjs");
/**
 * Multiple routes that are logically related to employee data
 */
const router = require("express").Router();

router.route("/:id").get(get);
router.route("/init").post(init);
router.route("/start").post(start);
router.route("/commit").post(commit);
router.route("/abort").post(abort);
router.route("/end").post(stop);
router.route("/put").put(put);
router.route("/add").post(post);
router.route("/delete").delete(dlt);

module.exports = router;
