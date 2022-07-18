const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const postDao = require("./postDao");
const userDao = require("../User/userDao");

//홈 화면 불러오기

exports.getPosts = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getPostsResult = await postDao.selectPosts(connection, userId);

    connection.release();

    return getPostsResult;
}