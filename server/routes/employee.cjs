const { get, init, start, commit, dlt, post, put, abort } = require("../controllers/employee.cjs");
/**
 * Multiple routes that are logically related to employee data
 */
const router = require("express").Router();

router.route("/employee/:id").get(get);
router.route("/employee/init").post(init);
router.route("/employee/start").post(start);
router.route("/employee/commit").post(commit);
router.route("/employee/abort").post(abort);
router.route("/employee/put").put(put);
router.route("/employee/add").post(post);
router.route("/employee/delete").delete(dlt);

module.exports = router;
