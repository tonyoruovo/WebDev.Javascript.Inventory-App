const { get, init, start, commit, dlt, post, put, abort } = require("../controllers/employee.cjs");
/**
 * Multiple routes that are logically related to employee data
 */
const router = require("express").Router();

router.route("/employee/:id").get(require("../controllers/middlewares/dbInit.cjs"), get);
router.route("/employee/init").post(require("../controllers/middlewares/dbInit.cjs"), init);
router.route("/employee/start").post(require("../controllers/middlewares/dbInit.cjs"), start);
router.route("/employee/commit").post(require("../controllers/middlewares/dbInit.cjs"), commit);
router.route("/employee/abort").post(require("../controllers/middlewares/dbInit.cjs"), abort);
router.route("/employee/put").put(require("../controllers/middlewares/dbInit.cjs"), put);
router.route("/employee/add").post(require("../controllers/middlewares/dbInit.cjs"), post);
router.route("/employee/delete").delete(require("../controllers/middlewares/dbInit.cjs"), dlt);

module.exports = router;
