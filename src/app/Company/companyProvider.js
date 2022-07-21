const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const companyDao = require("./companyDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

//이력서 회사 검색
exports.getCompanies = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getCompaniesResult = await companyDao.getCompanies(connection);
        connection.release();

        return response(baseResponse.SUCCESS,getCompaniesResult);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}