const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const skillDao = require("./skillDao");

// Provider: Read 비즈니스 로직 처리

exports.getSkills = async function (skillName) {
    
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        
        const skills=await skillDao.getSkillsByUsingName(connection,skillName);

        connection.release();


        return skills[0];
    }catch(err){
        logger.error(`App - Get Skills Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
