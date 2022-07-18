const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const jobDao = require("./jobDao");
const skillDao=require("../Skill/skillDao");
// Provider: Read 비즈니스 로직 처리

exports.getJobCategories = async function (jobGroupId) {
    console.log(jobGroupId);
    let skills=null;
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        
        const jobCategoryRows=await jobDao.getJobCategories(connection,jobGroupId);
    
        connection.release();

        
       

        return jobCategoryRows[0];
    }catch(err){
        logger.error(`App - Get Job Categories Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
