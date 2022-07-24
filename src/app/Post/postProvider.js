const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const postDao = require("./postDao");
const userDao = require("../User/userDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

//홈 화면 불러오기

exports.getPosts = async function (token) {
    console.log("Provider호출");
    const connection = await pool.getConnection(async (conn) => conn);
    const getCarouselResult = await postDao.getCarousel(connection);


    if(token==null) {
        console.log("token null");
        console.log("Query1 ");
        const getInsitePostTagsResult = await postDao.getInsitePostTags(connection);

        const tagId = getInsitePostTagsResult[0].tagId

        console.log("Query 2");
        const getInsitePostsResult = await postDao.getInsitePosts(connection, tagId);

        console.log("Query 3");
        const getArticlePostsResult = await postDao.getArticlePosts(connection);


        console.log("Query 4");
        const getVodPostsResult = await postDao.getVodPosts(connection);



        const resultResponse = {}
        const carousels = getCarouselResult;
        resultResponse.carousels = carousels;
        resultResponse.insitePostTags = getInsitePostTagsResult;
        resultResponse.insitePosts = getInsitePostsResult;
        resultResponse.articlePosts = getArticlePostsResult;
        resultResponse.vodPosts = getVodPostsResult;

        console.log("Response 앞");
        return resultResponse;
    }

    else {
        console.log("token is not null");
        const getInsitePostTagsResult = await postDao.getInsitePostInterestedTags(connection,token);

        const tagId = getInsitePostTagsResult[0].tagId

        const getInsitePostsResult = await postDao.getInsitePosts(connection, tagId);

        const getArticlePostsResult = await postDao.getArticlePosts(connection);

        const getVodPostsResult = await postDao.getVodPosts(connection);



        const resultResponse = {}
        const carousels = getCarouselResult;
        resultResponse.carousels = carousels;
        resultResponse.insitePostTags = getInsitePostTagsResult;
        resultResponse.insitePosts = getInsitePostsResult;
        resultResponse.articlePosts = getArticlePostsResult;
        resultResponse.vodPosts = getVodPostsResult;

        connection.release();
        return resultResponse;
    }

}

//인사이트 태그 누르면 다른 거 보여주기

exports.getPostsByTagId = async function (tagId){
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getPostsByTagIdResult = await postDao.getPostsByTagId(connection,tagId);
        connection.release();
        return response(baseResponse.SUCCESS,getPostsByTagIdResult);
    }
    catch(err){
        logger.error(`App - Get PostTags Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}