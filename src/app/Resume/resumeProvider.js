const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const resumeDao = require("./resumeDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");


//이력서 전체 조회
exports.getResumes = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getResumesResult = await resumeDao.getResumes(connection,userId);
    connection.release();

    return response(baseResponse.SUCCESS,getResumesResult);
};

//이력서 조회

exports.getResume = async function(getResumeParams) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        let getResumeResult = await resumeDao.getResumeInfo(connection,getResumeParams);

        if(getResumeResult.length==0){
            getResumeResult = null
        }
        let getResumeCareerResult = await resumeDao.getResumeCareer(connection,getResumeParams);

        if(getResumeCareerResult.length==0){
            getResumeCareerResult = null
        }

        let getResumeEducationResult = await resumeDao.getResumeEducation(connection,getResumeParams);

        if(getResumeEducationResult.length==0){
            getResumeEducationResult = null
        }

        let getResumeSkillsResult = await resumeDao.getResumeSkills(connection,getResumeParams);

        if(getResumeSkillsResult.length==0){
            getResumeSkillsResult = null
        }

        let getResumeAwardsResult = await resumeDao.getResumeAwards(connection,getResumeParams);

        if(getResumeAwardsResult.length==0){
            getResumeAwardsResult = null
        }

        let getResumeForeignResult = await resumeDao.getResumeForeign(connection,getResumeParams);

        if(getResumeForeignResult.length==0){
            getResumeForeignResult = null
        }
        let getResumeLink = await resumeDao.getResumeLink(connection,getResumeParams);

        if(getResumeLink.length==0){
            getResumeLink = null
        }
        const resultResponse = {}
        const resumeInfo = getResumeResult;
        resultResponse.resumInfo = resumeInfo;
        resultResponse.careerResult= getResumeCareerResult;
        resultResponse.educationResult = getResumeEducationResult;
        resultResponse.skillsResult = getResumeSkillsResult;
        resultResponse.awardsResult = getResumeAwardsResult;
        resultResponse.foreignResult = getResumeForeignResult;
        resultResponse.linkResult = getResumeLink;

        connection.release();

        return response(baseResponse.SUCCESS,resultResponse);
    }
    catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
//이력서 제목 조회
exports.getResumeTitle = async function (getResumeParams) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const getResumeTitleResult = await resumeDao.getResumeTitle(connection,getResumeParams);
        connection.release();

        return response(baseResponse.SUCCESS,getResumeTitleResult);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}



//이력서 학교 검색
exports.getEducationSchool = async function (schoolName) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getEducationSchoolResult = await resumeDao.getEducationSchool(connection,schoolName);
        connection.release();

        return response(baseResponse.SUCCESS,getEducationSchoolResult);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


//인기있는 스킬
exports.getPopularSkills = async function ( ) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const getPopularSkillsResult = await resumeDao.getPopularSkills(connection);
        connection.release();

        return response(baseResponse.SUCCESS,getPopularSkillsResult);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}

// 유저 스킬 가져오기

exports.getResumeUserSkills = async function (userId) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const getResumeUserSkillsResult = await resumeDao.getResumeUserSkills(connection,userId);
        connection.release();

        return response(baseResponse.SUCCESS,getResumeUserSkillsResult);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}
