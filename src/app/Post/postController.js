const jwtMiddleware = require("../../../config/jwtMiddleware");
const postProvider = require("../../app/Post/postProvider");
const postService = require("../../app/Post/postService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");

/**
 * API 1
 * 홈 화면 가져오기
 * [GET] /app/posts
 */

exports.getPosts = async function (req, res) {
    const userId=req.verifiedToken.userId

    const getPostsResponse = await postProvider.getPosts(userId);

    return res.send(getPostsResponse);

};