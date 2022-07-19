const jwtMiddleware = require("../../../config/jwtMiddleware");
const postTagProvider = require("../../app/PostTag/postTagProvider");
const postTagService = require("../../app/PostTag/postTagService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTags = async function (req, res) {
    
    
    const Tags=await postTagProvider.getTags();
    
    return res.send(response(baseResponse.SUCCESS,Tags))
}
