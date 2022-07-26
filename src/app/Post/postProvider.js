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


//vod tag
var vodTags = [
   {
    "name" : "HR",
    "tagId" : 18
},
    {
        "name" : "개발",
        "tagId" : 3
    },

    {
        "name" : "디자인",
        "tagId" : 7
    },
    {
        "name" : "기타",
        "tagId" : 27
    },
    {
        "name" : "경영·비즈니스",
        "tagId" : 19
    },
    {
        "name" : "마케팅",
        "tagId" : 25
    }]

//홈 화면 불러오기

exports.getPosts = async function (token) {

    const connection = await pool.getConnection(async (conn) => conn);
    const getCarouselResult = await postDao.getCarousel(connection);
    var num = 5
    var tagId='tagId'
    var params = [num,tagId]

    if(token==null) {


        const getInsitePostTagsResult = await postDao.getInsitePostTags(connection);

        const tagId = 3


        const getInsitePostsResult = await postDao.getInsitePosts(connection, tagId);
        console.log(getInsitePostsResult);

        const getArticlePostsResult = await postDao.getArticlePosts(connection,params);


        const getVodPostsResult = await postDao.getVodPosts(connection,params);



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

        const getArticlePostsResult = await postDao.getArticlePosts(connection ,params);

        const getVodPostsResult = await postDao.getVodPosts(connection,params);



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
        else if(filter=='최신등록순') {
            const getArticlePostsByCurrent = await postDao.getArticlePostsByCurrent(connection)

            const AllArticlePosts = {}
            AllArticlePosts.ArticlePostTags =getArticlePostTags
            AllArticlePosts.ArticlePostsByCurrent =getArticlePostsByCurrent
            return response(baseResponse.SUCCESS,AllArticlePosts);
            connection.release();
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


//아티클 포스트 자세히 보기

exports.getArticlePostDetails = async function (postId) {


    try {
        const num = 4

        const connection = await pool.getConnection(async (conn) => conn);
        const getArticlePostDetails = await postDao.getArticlePostDetails(connection,postId)
        const getArticlePostImg = await postDao.getArticlePostImg(connection,postId)
        const getArticleTag = await postDao.getArticleTag(connection,postId);
        console.log('tagId는 말이죵',getArticleTag )
        const  articleTagId= getArticleTag
        const  params = [num,articleTagId]
        const getArticlePostsResult = await postDao.getArticlePosts(connection,params);


        const articlePostDetails = {}
        articlePostDetails.articlePostDetails = getArticlePostDetails
        articlePostDetails.articlePostImg = getArticlePostImg
        articlePostDetails.recommendArticlePosts = getArticlePostsResult
        return response(baseResponse.SUCCESS,articlePostDetails);

    }
    catch(err){
        logger.error(`App - Get PostTags Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


exports.getVodPosts = async function (tagId) {
    try {
        if(!tagId) {
            //TODO 탑텐 숫자 구현
            //tag부터 불러오기
            const connection = await pool.getConnection(async (conn) => conn);
            const getTopTenContents = await postDao.getTopTenContents(connection)

            var vodPostsByTags = {}
            vodPostsByTags.topTenContents = getTopTenContents
            for (var i = 0; i < vodTags.length; i++) {
                var vodTagId = vodTags[i].tagId
                var vodName = vodTags[i].name

                var getVodPostsByTags = await postDao.getVodPostsByTags(connection, vodTagId)

                vodPostsByTags[vodName] = getVodPostsByTags;

            }

            return response(baseResponse.SUCCESS, vodPostsByTags);
        }
        else {
            const connection = await pool.getConnection(async (conn) => conn);
            var getVodPostsByTags = await postDao.getVodPostsByTags(connection, tagId)

            return response(baseResponse.SUCCESS,getVodPostsByTags);
        }

    }

    catch(err){
        logger.error(`App - Get PostTags Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
