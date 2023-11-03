
const asyncHandler = require("express-async-handler");
const { throws } = require("./middlewares/error.cjs");
const {add, mod, ret, rem} = require("../data/location.cjs");
const { Types } = require("mongoose");
// const { Activity } = require("../models/activity.cjs");


const get = asyncHandler(async function(rq, rs) {
    try {
        rs.status(200).json(await ret({
            _id: new Types.ObjectId(rq.params.id)
        }));
    } catch (e) {
        throws(e, "Not Found. The resource requested was unavailable", 404);
    }
});
const post = asyncHandler(async function(rq, rs) {
    // const activity = new Activity({
    //     _id: new Types.ObjectId(),
    //     a: "create",
    //     mn: "Location",
    //     msg: undefined,
    //     o: rq.user
    // });
    try {
        const e = await add(rq.body);
        return rs.status(201).json(e);
    } catch (e) {
        throws(e, "Forbidden. Invalid action", 403);
    }
});
const update = asyncHandler(async function(rq, rs) {
    try {
        await mod(rq.body);
        return rs.status(204);
    } catch (e) {
        throws(e, "Forbidden. Invalid action", 403);
    }
});
const remove = asyncHandler(async function(rq, rs) {
    try {
        await rem(rq.body);
        return rs.status(204);
    } catch (e) {
        throws(e, "Not Found. The resource requested was unavailable", 404);
    }
});

module.exports = {
    get, post, update, remove
}