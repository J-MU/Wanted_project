const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const resumeProvider = require("./resumeProvider");
const resumeDao = require("./resumeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.deleteResumes = async function (userId, resumeId) {
    try {
        //TODO deleted확인
        const deleteResumesParams = [userId, resumeId]
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteResumesResult = await resumeDao.deleteResumes(connection,deleteResumesParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    }

    catch (err) {
            logger.error(`App - createUser Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }

};

exports.postResumes = async function(userId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const postResumesResult = await resumeDao.postResumes(connection,userId);
        connection.release();

        return response(baseResponse.SUCCESS);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//이력서 제목 변경

exports.patchResumeTitle = async function(getResumeParams) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const patchResumeTitleResult = await resumeDao.patchResumeTitle(connection,getResumeParams);
        connection.release();

        return response(baseResponse.SUCCESS);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//이력서 경력 추가

exports.postResumeCareer = async function(postResumeCareerParams){
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const postResumeCareerResult = await resumeDao.postResumeCareer(connection,postResumeCareerParams);
        connection.release();

        return response(baseResponse.SUCCESS);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteResumeCareer = async function (careerId) {
    try {
        //TODO deleted확인
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteResumeCareerResult = await resumeDao.deleteResumeCareer(connection,careerId);
        connection.release();

        return response(baseResponse.SUCCESS);
    }

    catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

//이력서 학교 추가
exports.postEducationSchool = async function(postEducationSchoolParams ){
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const postEducationSchoolResult = await resumeDao.postEducationSchool(connection,postEducationSchoolParams );
        connection.release();

        return response(baseResponse.SUCCESS);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//이력서 학교 삭제
exports.deleteResumeEducation = async function (educationId) {
    try {
        //TODO deleted확인
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteResumeEducationResult = await resumeDao.deleteResumeEducation(connection,educationId);
        connection.release();

        return response(baseResponse.SUCCESS);
    }

    catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

//이력서 수상 추가
exports.postResumeAwards = async function(postResumeAwardsParams){
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const postResumeAwardsResult = await resumeDao.postResumeAwards(connection,postResumeAwardsParams);
        connection.release();

        return response(baseResponse.SUCCESS);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


//이력서 수상 삭제

exports.deleteResumeAwards = async function(awardsId) {
    try {
        //TODO deleted확인
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteResumeAwardsResult = await resumeDao.deleteResumeAwards(connection,awardsId);
        connection.release();

        return response(baseResponse.SUCCESS);
    }

    catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}

//이력서 상태 수정

exports.patchResumeStatus = async function(resumeId) {
    try {
        // 간단 소개글 글자 수 확인하기
        const selfIntroductionRows = await resumeProvider.selfIntroductionCheck(resumeId);

        if(selfIntroductionRows<400)
            return errResponse(baseResponse.SELFINTRODUCTIONNUM_ERROR);

        // 경력 있는지 확인
        const careerCheck = await resumeProvider.careerCheck(resumeId);
        if(careerCheck.length>0){
            for (var x in careerCheck) {
                if (careerCheck[x].startDate==null)
                    return errResponse(baseResponse.INPUTDATE_ERROR);
            }
        }

        //전공 들어가 있는지 확인
        const majorCheck = await resumeProvider.majorCheck(resumeId);
        console.log(majorCheck);
        if(majorCheck.length>0){
            for (var x in majorCheck) {
                if (majorCheck[x].MajorOrDegree==null)
                    return errResponse(baseResponse.INPUTMAJOR_ERROR);
            }
        }
        // // const connection = await pool.getConnection(async (conn) => conn);
        // const patchResumeStatusResult = await resumeDao.patchResumeStatus(connection,resumeId);
        // connection.release();
        //
        // return response(baseResponse.SUCCESS);
    }

    catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}