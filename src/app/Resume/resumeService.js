const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const resumeProvider = require("./resumeProvider");
const resumeDao = require("./resumeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const {Response} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.deleteResumes = async function (userId, resumeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        //TODO deleted확인

        const deleteResumeCheck = await resumeDao.deleteResumeCheck(connection, resumeId);

        if(deleteResumeCheck[0].status=='DELETED') {
            return response(baseResponse.RESUMEID_ALREADY_DELETED);
        }
        const deleteResumesParams = [userId, resumeId]
        const deleteResumesResult = await resumeDao.deleteResumes(connection,deleteResumesParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    }

    catch (err) {
            if(err=="deleteResumeCheck Query err") return errResponse({"isSuccess":false, "code":4109, "message":"deleteResumeCheck Query err"});
            logger.error(`App - createUser Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }

};

exports.postResumes = async function(userId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        const postResumesResult = await resumeDao.postResumes(connection,userId);
        connection.release();
        const num = postResumesResult.length
        const resumeId = {'resumeId' : postResumesResult[num-1].resumeId }
        

        return response(baseResponse.SUCCESS,resumeId);

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
        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,getResumeParams[1]);

        if(resumeIdCheck.length==0){
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }


        const patchResumeTitleResult = await resumeDao.patchResumeTitle(connection,getResumeParams);
        connection.release();

        return response(baseResponse.SUCCESS);

    }
    catch(err) {
        if(err=="resumeIdCheck Query err") return errResponse({"isSuccess":false, "code":4110, "message":"resumeIdCheck Query err"});
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//이력서 경력 추가

exports.postResumeCareer = async function(postResumeCareerParams){
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        //resumeId 존재여부 확인

        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,postResumeCareerParams[0]);

        if(resumeIdCheck.length==0){
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }

        //resumeId랑 토큰 Id가 같은 사람인지 확인
        const resumeUserCheckParams = [ postResumeCareerParams[0],postResumeCareerParams[3]]
        const resumeUserCheck = await resumeDao.resumeUserCheck(connection,resumeUserCheckParams);
        if(resumeUserCheck==0) {
            return errResponse(baseResponse.NOT_USER_RESUME);
        }


        const postResumeCareerResult = await resumeDao.postResumeCareer(connection,postResumeCareerParams);

        const num = postResumeCareerResult.length
        connection.release();
        return response(baseResponse.SUCCESS,postResumeCareerResult[num-1]);

    }
    catch(err) {
        if(err=="resumeIdCheck Query err") return errResponse({"isSuccess":false, "code":4110, "message":"resumeIdCheck Query err"});
        if(err=="resumeUserCheck Query err") return errResponse({"isSuccess":false, "code":4111, "message":"resumeUserCheck Query err"});
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.deleteResumeCareer = async function (careerId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        //career가 존재하는지
        const careerIdCheck = await resumeDao.careerIdCheck(connection, careerId);

        if(careerIdCheck.length==0) {
            return errResponse(baseResponse.CAREER_NOT_EXIST);
        }
        //career 삭제 되어 있는지 확인

        const careerDeletedCheck = await resumeDao.careerDeletedCheck(connection,careerId);

        if(careerDeletedCheck[0].status=='DELETED'){
            return errResponse(baseResponse.CAREER_ALREADY_DELETED);
        }

        const deleteResumeCareerResult = await resumeDao.deleteResumeCareer(connection,careerId);
        connection.release();

        return response(baseResponse.SUCCESS);
    }

    catch (err) {
        if(err="careerDeletedCheck Query err") return errResponse({"isSuccess":false, "code":4112, "message":"careerDeletedCheck Query err"});
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

//이력서 학교 추가
exports.postEducationSchool = async function(postEducationSchoolParams ){

    const connection = await pool.getConnection(async (conn) => conn);

    try {
        //이력서 Id 존재하는지 체크
        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,postEducationSchoolParams[0]);

        if(resumeIdCheck.length==0){
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }

        //resumeId랑 토큰 Id가 같은 사람인지 확인
        const resumeUserCheckParams = [ postEducationSchoolParams[0],postEducationSchoolParams[2]]
        const resumeUserCheck = await resumeDao.resumeUserCheck(connection,resumeUserCheckParams);
        if(resumeUserCheck==0) {
            return errResponse(baseResponse.NOT_USER_RESUME);
        }

        const postEducationSchoolResult = await resumeDao.postEducationSchool(connection,postEducationSchoolParams );

        const num = postEducationSchoolResult.length
        connection.release();
        return response(baseResponse.SUCCESS,postEducationSchoolResult[num-1]);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//이력서 경력 수정
exports.patchResumeCareer = async function (params) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        //careerId validation
        const careerIdCheck = await resumeDao.careerIdCheck(connection, params[0])
        connection.release();
        if (careerIdCheck.length == 0) {

            return response(baseResponse.CAREERID_NOTEXIST);
        }
        else {
            const patchResumeCareerResult = await resumeDao.patchResumeCareer(connection, params);


            return response(baseResponse.SUCCESS);

        }
        connection.release();
    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


//이력서 학교 수정
exports.patchResumeEducation = async function(params) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        //educationId check
        const educationIdCheck = await resumeDao.educationIdCheck(connection, params[0])
        connection.release();
        if (educationIdCheck.length == 0) {

            return response(baseResponse.EDUCATIONID_NOTEXIST);
        }

        const patchResumeEducationResult = await resumeDao.patchResumeEducation(connection,params);
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
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        //educationId 존재하는 지 확인

        const educationIdCheck = await resumeDao.educationIdCheck(connection, educationId)

        if(educationIdCheck.length==0) {
            return errResponse(baseResponse.EDUCATION_NOT_EXIST);
        }

        //educationId 삭제되었는 지 확인

        const educationDeletedCheck = await resumeDao.educationDeletedCheck(connection, educationId)

        if(educationDeletedCheck[0].status=='DELETED') {
            return errResponse(baseResponse.EDUCATION_ALREADY_DELETED);
        }

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
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        const postResumeAwardsResult = await resumeDao.postResumeAwards(connection,postResumeAwardsParams);


        const num = postResumeAwardsResult.length
        connection.release();
        return response(baseResponse.SUCCESS,postResumeAwardsResult[num-1]);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//이력서 수상 수정

exports.patchResumeAwards = async function(params) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const awardsIdCheck = await resumeDao.awardsIdCheck(connection, params[0]);

        if(awardsIdCheck.length==0) {
            connection.release();
            return response(baseResponse.AWARDSID_NOTEXIST);
        }
        else {
            const patchResumeAwardsResult = await resumeDao.patchResumeAwards(connection, params);

            connection.release();
            return response(baseResponse.SUCCESS);
        }


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

exports.patchResumeStatus = async function(resumeId,status) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        if(status=='작성 완료') {

            // resumeId validation
            const resumeIdCheck = await resumeDao.resumeIdCheck(connection, resumeId);

            if(resumeIdCheck.length==0) {
                return errResponse(baseResponse.RESUMEID_NOT_EXIST);
            }

            // 간단 소개글 글자 수 확인하기
            const selfIntroductionRows = await resumeProvider.selfIntroductionCheck(resumeId);

            if (selfIntroductionRows < 400)
                return errResponse(baseResponse.SELFINTRODUCTIONNUM_ERROR);

            var result = []
            // 경력 있는지 확인
            const careerCheck = await resumeProvider.careerCheck(resumeId);
            if (careerCheck.length > 0) {
                for (var x in careerCheck) {
                    if (careerCheck[x].startDate == null || careerCheck[x].startDate == '') {
                        result.push('경력');
                        // return errResponse(baseResponse.INPUTDATE_ERROR, baseResponse.INPUTMAJOR_ERROR);
                    }
                }
            }

            //전공 들어가 있는지 확인
            const majorCheck = await resumeProvider.majorCheck(resumeId);
            if (majorCheck.length > 0) {
                for (var x in majorCheck) {
                    if (majorCheck[x].MajorOrDegree == null || majorCheck[x].MajorOrDegree == '') {
                        result.push('전공');
                        // return errResponse(baseResponse.INPUTMAJOR_ERROR);
                    }

                }
            }

            //수상 활동명 들어가 있는지 체크
            const awardsCheck = await resumeProvider.awardsCheck(resumeId);
            if (awardsCheck.length > 0) {
                for (var x in awardsCheck) {
                    if (awardsCheck[x].details == null || awardsCheck[x].details == '') {
                        result.push('수상 세부사항');
                    }

                }
            }

            if (result.length == 0) {
                const connection = await pool.getConnection(async (conn) => conn);
                const postResumeStatus = await resumeDao.postResumeStatus(connection, resumeId);
                connection.release();
                return response(baseResponse.SUCCESS);
            } else {
                var erroMessage = {}
                for (var i = 0; i < result.length; i++) {
                    if (result[i] == '경력') {
                        erroMessage.careerMessage = '경력 > 기간'
                    } else if (result[i] == '전공') {
                        erroMessage.educationMessage = '학력 > 전공 및 학위'
                    } else {
                        erroMessage.awardsDetailMessage = '수상 및 기타 > 활동명 > 세부사항'
                    }

                }
                return response(baseResponse.FAILED_ERROR, erroMessage);

            }
        }
        else{
            const connection = await pool.getConnection(async (conn) => conn);
            const postResumeStatusIng = await resumeDao.postResumeStatusIng(connection, resumeId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    }

    catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}

//이력서 유저 스킬 추가
exports.postResumeUserSkills = async function(resumeId,userId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const resumeIdCheck = await resumeDao.resumeIdCheck(connection, resumeId);

        if(resumeIdCheck.length==0) {
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }
        const getResumeUserSkillsResult = await resumeDao.getResumeUserSkills(connection,userId);

        for (x in getResumeUserSkillsResult) {
            const param = getResumeUserSkillsResult[x].skillId
            const params =[resumeId, param]
            const postResumeUserSkills = await resumeDao.postResumeUserSkills(connection, params);
        }
        connection.release();
        return response(baseResponse.SUCCESS);

    }

    catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}

//이력서 스킬 추가
exports.postResumeSkills = async function(resumeId,skillId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const postResumeSkillsParams = [resumeId, skillId]

        //resumeId validation

        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,postResumeSkillsParams[0]);

        if(resumeIdCheck.length==0){
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }

        //skillId validation
        const skillIdCheck = await resumeDao.skillIdCheck(connection,postResumeSkillsParams[1]);

        if(skillIdCheck.length==0){
            return errResponse(baseResponse.SKILLID_NOTEXIST);
        }

        const postResumeSkillsResult = await resumeDao.postResumeSkills(connection, postResumeSkillsParams);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }


}


//이력서 스킬 삭제

exports.deleteResumeSkills = async function(deleteResumeSkillsParams){
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        //resumeId 존재하는지
        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,deleteResumeSkillsParams[0]);

        if(resumeIdCheck.length==0){
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }

        //skillId 존재하는지
        const skillIdCheck = await resumeDao.skillIdCheck(connection,deleteResumeSkillsParams[1]);

        if(skillIdCheck.length==0){
            return errResponse(baseResponse.SKILLID_NOTEXIST);
        }

        //유저의 skillId가 맞는지

        const userSkillCheck = await resumeDao.userSkillCheck(connection, deleteResumeSkillsParams);
        if(userSkillCheck.length==0){
            return errResponse(baseResponse.NOT_USERSKILL);
        }

        //skillId 이미 삭제되어 잇는지
        const skillIdDeletedCheck = await resumeDao.skillIdDeletedCheck(connection,deleteResumeSkillsParams);

        if(skillIdDeletedCheck[0].status=='DELETED'){
            return errResponse(baseResponse.SKILLID_ALREADY_DELETED);
        }


        const deleteResumeSkillsResult = await resumeDao.deleteResumeSkills(connection,deleteResumeSkillsParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    }

    catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//이력서 userInfo 수정

exports.patchResumeUserInfo = async function(params) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        //resumeId validation

        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,params[0]);

        if(resumeIdCheck.length==0){
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }

        const patchResumeUserInfoResult = await resumeDao.patchResumeUserInfo(connection,params);
        connection.release();

        return response(baseResponse.SUCCESS);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//이력서 외국어 추가

exports.postResumeForeignLanguage = async function(params) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,params[0]);

        if(resumeIdCheck.length==0){
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }

        const postResumeForeignLanguageResult = await resumeDao.postResumeForeignLanguage(connection,params);

        const num = postResumeForeignLanguageResult.length
        connection.release();
        const foreignLanguageId = {Id : postResumeForeignLanguageResult[num-1]}
        return response(baseResponse.SUCCESS,foreignLanguageId);
    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//이력서 외국어 삭제

exports.deleteResumeForeignLanguage= async function (params) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,params[0]);

        if(resumeIdCheck.length==0) {
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }

        const foreignLanguageDeletedCheck = await resumeDao.foreignLanguageDeletedCheck(connection,params);

        if(foreignLanguageDeletedCheck[0].status=='DELETED') {
            return errResponse(baseResponse.FOREIGNLANGUAGEID_ALREADY_DELETED);
        }

        const deleteResumeForeignLanguageResult = await resumeDao.deleteResumeForeignLanguage(connection,params);

        connection.release();
        return response(baseResponse.SUCCESS);
    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}