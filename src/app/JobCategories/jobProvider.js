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

exports.getJobGroupCategories = async function () {
    
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        
        const jobGroupCategories=await jobDao.getJobGroupCategories(connection);
    
        connection.release();

        
       

        return jobGroupCategories[0];
    }catch(err){
        logger.error(`App - Get Job Group Categories Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.checkInheritanceJobandJobGroupCategory = async function (jobId) {
    
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        
        const JobGroupCategoryId=await jobDao.getJobGroupCategoryId(connection,jobId);
        let boolean=false;
        if(JobGroupCategoryId.length>0)
            boolean=true;

        console.log("JobGroupCategory ID:");
        console.log(JobGroupCategoryId,boolean);
        connection.release();

        return boolean;
    }catch(err){
        logger.error(`App - checkInheritanceJobandJobGroupCategory Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.getJobNameUsingProfileId=async function(profileId){
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        const jobName=await jobDao.getJobNameUsingProfileId(connection,profileId);

        console.log("jobName:",jobName);
        return jobName[0].name;
    }catch(err){
        logger.error(`App - get Job Name Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

