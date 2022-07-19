const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const postDao = require("./postDao");
const userDao = require("../User/userDao");

//홈 화면 불러오기

exports.getPosts = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getCarouselResult = await postDao.getCarousel(connection);
    connection.release();

    const connectionA = await pool.getConnection(async (conn) => conn);
    const getInsitePostsResult = await postDao.getInsitePosts(connectionA);
    connection.release();

    const connectionB = await pool.getConnection(async (conn) => conn);
    const getArticlePostsResult = await postDao.getArticlePosts(connectionB);
    connection.release();

    const connectionC = await pool.getConnection(async (conn) => conn);
    const getVodPostsResult = await postDao.getVodPosts(connectionC);
    connection.release();


    const resultResponse = {}
    const carousels = getCarouselResult;
    resultResponse.carousels = carousels;
    resultResponse.insitePosts = getInsitePostsResult;
    resultResponse.articlePosts = getArticlePostsResult;
    resultResponse.vodPosts = getVodPostsResult;
    console.log(resultResponse);

    return resultResponse;

}