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
    const getPostsResponse = await postProvider.getPosts(token);

    return res.send(getPostsResponse);

};


/**
 * 홈 화면 가져오기
 * [GET] /app/posts/article
 */

exports.getArticlePosts = async function (req, res) {
    // const userId=req.verifiedToken.userId

    const getPostsResponse = await postProvider.getPosts();

    return res.send(getPostsResponse);

};

/**
 * 인사이트 태그 누를 때마다 다른 거
 * /app/posts/insitePostTags/tagId=?
 *
 */

exports.getPostsByTagId = async function (req, res) {

    const tagId= req.params.tagId;


    const getPostsByTagId = await postProvider.getPostsByTagId(tagId);

    return res.send(getPostsByTagId)

}