const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const postDao = require("./postDao");
const userDao = require("../User/userDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

//아티클 포스트 태그들
var getArticlePostTags = [{
    "name" : "커리어고민 ",
    "tagId" : 2
},{
    "name" : "HR",
    "tagId" : 18
},
    {
        "name" : "경영·비즈니스",
        "tagId" : 19
    },
    {
        "name" : "회사생활",
        "tagId" : 4
    },
    {
        "name" : "개발",
        "tagId" : 3
    },
    {
        "name" : "취업/이직",
        "tagId" : 16
    },
    {
        "name" : "브랜딩",
        "tagId" : 15
    },
    {
        "name" : "IT/기술",
        "tagId" : 1
    }]

//홈 화면 불러오기

exports.getPosts = async function (token) {

    const connection = await pool.getConnection(async (conn) => conn);
    const getCarouselResult = await postDao.getCarousel(connection);


    if(token==null) {

        const getInsitePostTagsResult = await postDao.getInsitePostTags(connection);

        const tagId = 3


        const getInsitePostsResult = await postDao.getInsitePosts(connection, tagId);
        console.log(getInsitePostsResult);

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


//아티클 포스트 전체보기 (디폴트 = "마감임박순")
exports.getArticlePosts = async function (filter) {
    try {
        console.log(filter)
        const connection = await pool.getConnection(async (conn) => conn);


        if(filter=='마감임박순'){
            const getArticlePostsByDate = await postDao.getArticlePostsByDate(connection)

            connection.release();

            const getArticlePosts = await postDao.getArticlePosts(connection)

            const AllArticlePosts = {}
            AllArticlePosts.ArticlePostTags =getArticlePostTags
            AllArticlePosts.articlePostsByDate=getArticlePostsByDate
            AllArticlePosts.articlePosts = getArticlePosts

            return response(baseResponse.SUCCESS,AllArticlePosts);
        }


    }
    catch(err){
        logger.error(`App - Get PostTags Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//아티클 포스트 가져오기 by 태그로 ( 디폴트 = 마감임박순)
exports.getArticlePostsByTagId = async function (tagId,filter) {
    try {
        console.log(filter)
        const connection = await pool.getConnection(async (conn) => conn);
        if(filter=='마감임박순'){
            console.log('마감!')
            const getArticlePostsByTagIdAndDate = await postDao.getArticlePostsByTagIdAndDate(connection,tagId)

            const getArticlePostsByTagId = await postDao.getArticlePostsByTagId(connection, tagId)


            var getArticelPostsByTagIdResult = {}
            getArticelPostsByTagIdResult.getArticlePostsByTagIdAndDate=getArticlePostsByTagIdAndDate
            getArticelPostsByTagIdResult.getArticlePostsByTagId=getArticlePostsByTagId

            connection.release();

            return response(baseResponse.SUCCESS,getArticelPostsByTagIdResult);

        }
    }

    catch(err){
        logger.error(`App - Get PostTags Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}