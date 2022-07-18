const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const jobDao = require("./jobDao");

// Provider: Read 비즈니스 로직 처리

exports.getJobCategories = async function (jobGroupId) {
    console.log(jobGroupId);
    let skills=null;
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        
        const jobCategoryRows=await jobDao.getJobCategories(connection,jobGroupId);
        console.log(jobCategoryRows[0]);
        if(jobGroupId==1){
            skills=await jobDao.getSkills(connection);    //TODO skill Domain으로 옮겨야함.
        }else{
            skills=null;
        }
        connection.release();

        const ResultRows={};
        ResultRows.jobCategories=jobCategoryRows[0];
        ResultRows.skills=skills[0];

        return ResultRows;
    }catch(err){
        logger.error(`App - Get Job Categories Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
