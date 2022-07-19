const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const resumeDao = require("./resumeDao");



exports.getResumes = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getResumesResult = await resumeDao.getResumes(connection);
    connection.release();
    return  getResumesResult;
};