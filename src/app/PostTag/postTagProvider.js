const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const postTagDao = require("./postTagDao");

// Provider: Read 비즈니스 로직 처리

exports.getTags = async function () {
    
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        
        const postTags=await postTagDao.getPostTags(connection);

        connection.release();


        return postTags;
    }catch(err){
        logger.error(`App - Get PostTags Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
