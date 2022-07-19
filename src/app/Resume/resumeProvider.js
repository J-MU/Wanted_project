const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const resumeDao = require("./resumeDao");
const {response} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");



exports.getResumes = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getResumesResult = await resumeDao.getResumes(connection,userId);
    connection.release();

    return response(baseResponse.SUCCESS,getResumesResult);
};