const { badReq } = require("./middlewares/error.cjs"),
  asyncHandler = require("express-async-handler"),
  /**
   * Runs the given low-level
   * @body CmdParam
   * @method POST
   * @access protected admins only
   * @route /api/v1/cmd/run
   * @type {import("./middlewares/d.cjs").Middleware<undefined, import("../data/cmd.cjs").CmdParam, Record<string, *>, undefined>}
   */
  run = asyncHandler(async function (req, res) {
    try {
      const r = await require("../data/cmd.cjs").run(req.body);
      res.status(200).json(r);
    } catch (e) {
      e.message = "ValidateUser failed. See docs for hints\n" + e.message;
      badReq(e);
    }
  });
module.exports = {run};
