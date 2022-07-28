const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const schoolDao = require("./schoolDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const resumeDao = require("../Resume/resumeDao");

//학교 검색
exports.getSchools = async function () {
    try {
        let getSchoolsResult;
        
        const connection = await pool.getConnection(async (conn) => conn);
        try{
            getSchoolsResult = await schoolDao.getSchools(connection);
        }catch(err){
            if(err="getSchoolsFail") throw "getSchoolsFail"
        }
        connection.release();

        return getSchoolsResult;
    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
