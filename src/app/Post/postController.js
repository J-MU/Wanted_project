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
    console.log("Controller 들어옴.");
    // const userId=req.verifiedToken.userId
    let token = req.verifiedToken;
    if(!token) {
        token=null
    }
    else {
        token = req.verifiedToken.userId
    }
    // if(req.verifiedToken) {
    //     console.log('True')
    // }
    // else {
    //     console.log('False')
    // }
    console.log("Provider 호출");
    const getPostsResponse = await postProvider.getPosts(token);
    console.log("Provider호출 완료");
    return res.send(getPostsResponse);

};


/**
 * 홈 화면 가져오기
 * [GET] /app/posts/article
 */

exports.getArticlePosts = async function (req, res) {
    // const userId=req.verifiedToken.userId
    const filter = req.body.filter;

    const getArticlePostsResponse = await postProvider.getArticlePosts(filter);

    return res.send(getArticlePostsResponse);

};

/**
 * 인사이트 태그 누를 때마다 다른 거
 * /app/posts/insitePostTags/tagId=?
 *
 */

exports.getPostsByTagId = async function (req, res) {

    const tagId= req.query.tagId;

    //validation

    const getPostsByTagId = await postProvider.getPostsByTagId(tagId);

    return res.send(getPostsByTagId)

}