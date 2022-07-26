const jwtMiddleware = require("../../../config/jwtMiddleware");
const resumeProvider = require("../../app/Resume/resumeProvider");
const resumeService = require("../../app/Resume/resumeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");
const postProvider = require("../Post/postProvider");

/**
 * 이력서 전체 조회
 * [GET] app/resumes
 */

exports.getResumes = async function (req, res) {
    //TODO userId validation
    const userId = req.verifiedToken.userId


    const getResumesResponse = await resumeProvider.getResumes(userId);

    return res.send(getResumesResponse);

};

/**
 * 이력서 삭제
 * * [patch] app/resumes/:resumeId/deleted
 */

exports.deleteResumes = async function (req, res) {
    const userId = req.verifiedToken.userId

    const resumeId = parseInt(req.params.resumeId)

    if (!resumeId)  return res.send(response(baseResponse.RESUMEID_EMPTY));

    const getResumesResponse = await resumeService.deleteResumes(userId, resumeId);

    return res.send(getResumesResponse);

};

/**
 * 이력서 생성
 * [POST] /app/resumes
 */
exports.postResumes = async function(req, res) {
    const userId = req.verifiedToken.userId

    const postResumesResponse = await resumeService.postResumes(userId);

    return res.send(postResumesResponse)

}


/**
 * 이력서 조회
 * [GET] /app/resumes/:resumeId
 */

exports.getResume = async function(req, res) {
    console.log("사ㅅ바사바 분신사바");
    const userId = req.verifiedToken.userId

    const resumeId = parseInt(req.params.resumeId)

    const getResumeParams = [userId, resumeId]
    if (!resumeId)  return res.send(response(baseResponse.RESUMEID_EMPTY));

    const getResumeResponse = await resumeProvider.getResume(getResumeParams);

    return res.send(getResumeResponse);

}

/**
 * 이력서 조회
 * [GET] /app/resumes/:resumeId/title
 */
//이력서 이름 가져오기
exports.getResumeTitle = async function(req, res) {
    const userId = req.verifiedToken.userId

    const resumeId = parseInt(req.params.resumeId)

    const getResumeParams = [userId, resumeId]
    if (!resumeId)  return res.send(response(baseResponse.RESUMEID_EMPTY));

    const getResumeResponse = await resumeProvider.getResumeTitle(getResumeParams);

    return res.send(getResumeResponse);
}

/**
 * 이력서 이름 변경
 * [PATCH] /app/resumes/:resumeId/title
 */

exports.patchResumeTitle = async function(req, res) {
    const userId = req.verifiedToken.userId

    const resumeId = parseInt(req.params.resumeId)

    const resumeName = req.body.resumeName

    const getResumeParams = [userId, resumeId,resumeName]
    if (!resumeId)  return res.send(response(baseResponse.RESUMEID_EMPTY));

    const patchResumeTitleResponse = await resumeService.patchResumeTitle(getResumeParams);

    return res.send(patchResumeTitleResponse);
}



/**
 * 이력서 경력 추가(회사 검색)
 * [post] /app/resumes/:resumeId/career
 */

exports.postResumeCareer = async function(req, res) {
    const resumeId = parseInt(req.params.resumeId)
    const companyName = req.body.companyName;
    const type = req.body.type;

    if(!companyName) return res.send(response(baseResponse.COMPANYNAME_EMPTY));

    const postResumeCareerParams = [resumeId, companyName, type]

    const postResumeCareerResponse = await resumeService.postResumeCareer(postResumeCareerParams);

    return res.send(postResumeCareerResponse);
}

/**
 *이력서 커리어 삭제
 *[patch] /app/resumes/career/:careerId/deleted
 */

exports.deleteResumeCareer = async function (req, res) {

    const careerId = parseInt(req.params.careerId)
    console.log(careerId);
    // if (!resumeId)  return res.send(response(baseResponse.RESUMEID_EMPTY));

    const deleteResumeCareerResponse = await resumeService.deleteResumeCareer(careerId);

    return res.send(deleteResumeCareerResponse);

};

/**
 * 이력서 경력 수정
 *
 */

exports.patchResumeCareer = async function (req, res) {
    const careerId= req.params.careerId
    const companyName = req.body.companyName
    const type = req.body.type
    const DepartmentAndTitle = req.body.DepartmentAndTitle
    const startDate = req.body.startDate
    const endDate = req.body.endDate

    const params = [careerId , companyName, type, DepartmentAndTitle, startDate, endDate]


    const patchResumeCareerResponse = await resumeService.patchResumeCareer(params);

    return res.send(patchResumeCareerResponse);

}
/**
 * 이력서 학교 검색
 * [get]
 */

exports.getEducationSchool =  async function (req, res) {
    const schoolName = req.body.schoolName;

    if(!schoolName) return res.send(response(baseResponse.SCHOOLNAME_EMPTY));
    const getEducationSchoolResponse = await resumeProvider.getEducationSchool(schoolName);

    return res.send(getEducationSchoolResponse);
}


/**
 * 이력서 학교 추가
 * [post] /app/resumes/education/school
 */

exports.postEducationSchool = async function(req, res) {
    const resumeId = parseInt(req.params.resumeId)
    const schoolName = req.body.schoolName;

    if(!schoolName) return res.send(response(baseResponse.SCHOOLNAME_EMPTY));

    const postEducationSchoolParams = [resumeId,schoolName]

    const postResumeCareerResponse = await resumeService.postEducationSchool(postEducationSchoolParams );

    return res.send(postResumeCareerResponse);
}

/**
 * 이력서 학력 수정
 *
 */

exports.patchResumeEducation = async function(req, res) {
    const educationId= req.params.educationId
    const name = req.body.name
    const MajorOrDegree = req.body.MajorOrDegree
    const subject = req.body.subject
    const startDate = req.body.startDate
    const endDate = req.body.endDate

    const params = [educationId , name, MajorOrDegree, subject, startDate, endDate]


    const patchResumeEducationResponse = await resumeService.patchResumeEducation(params);

    return res.send(patchResumeEducationResponse);

}
/**
 * 이력서 학교 삭제
 * [patch]
 */

exports.deleteResumeEducation = async function (req, res) {

    const educationId = parseInt(req.params.educationId)
    console.log(educationId);
    // if (!resumeId)  return res.send(response(baseResponse.RESUMEID_EMPTY));

    const deleteResumeEducationResponse = await resumeService.deleteResumeEducation(educationId);

    return res.send(deleteResumeEducationResponse);

};

/**
 * 이력서 인기있는 스킬
 * [get] /app/resumes/popularSkills
 */

exports.getPopularSkills =  async function (req, res) {

    const getPopularSkillsResponse = await resumeProvider.getPopularSkills();

    return res.send(getPopularSkillsResponse);
}

/**
 * 유저 스킬 가져오기
 * [get]
 *
 */

exports.getResumeUserSkills = async function (req, res) {
    const userId = req.verifiedToken.userId

    const getResumeUserSkillsResponse = await resumeProvider.getResumeUserSkills(userId);

    return res.send(getResumeUserSkillsResponse);
}

/**
 * 수상 및 기타 추가
 * [post] /app/resumes/:resumeId/awards
 */

exports.postResumeAwards = async function (req, res) {
    const resumeId =parseInt(req.params.resumeId)
    const period = req.body.period
    const name = req.body.name
    const details = req.body.details

    const postResumeAwardsParams = [resumeId, period, name, details]
    if(!name) return res.send(response(baseResponse.AWARDSNAME_EMPTY));
    const postResumeAwardsResponse = await resumeService.postResumeAwards(postResumeAwardsParams);

    return res.send(postResumeAwardsResponse);

}

/**
 * 수상 수정
 */

exports.patchResumeAwards = async function(req, res) {
    const awardsId= req.params.awardsId
    const period = req.body.period
    const name = req.body.name
    const details = req.body.details

    const params = [awardsId , period, name, details]


    const patchResumeAwardsResponse = await resumeService.patchResumeAwards(params);

    return res.send(patchResumeAwardsResponse);
}

 /**
 * 수상 및 기타 삭제
 * [patch] /app/resumes/awards/:awardsId
 */

exports.deleteResumeAwards = async function (req, res) {
    const awardsId = parseInt(req.params.awardsId)

    const deleteResumeAwardsResponse = await resumeService.deleteResumeAwards(awardsId);

    return res.send(deleteResumeAwardsResponse);

}

/**
 * 이력서 작성 완료 API
 *
 */

exports.patchResumeStatus = async function (req, res) {
    const resumeId= parseInt(req.params.resumeId);
    const status = req.body.status;

    const checkResumeResponse = await resumeService.patchResumeStatus(resumeId,status);
    // const patchResumeStatusResponse


    return res.send(checkResumeResponse);

};

/**
 * 유저 스킬 추가
 *
 */
exports.postResumeUserSkills = async function(req, res) {
    const resumeId= parseInt(req.params.resumeId);
    const userId = req.verifiedToken.userId

    const postResumeUserSkillsResponse = await resumeService.postResumeUserSkills(resumeId,userId);

    return res.send(postResumeUserSkillsResponse);
}

/**
 * 스킬 추가
 *
 */

exports.postResumeSkills =  async function(req, res) {
    const resumeId= parseInt(req.params.resumeId);
    const skillId = parseInt(req.body.skillId);

    const postResumeSkillsResponse = await resumeService.postResumeSkills(resumeId,skillId);

    return res.send(postResumeSkillsResponse);

}


/**
 * 스킬 삭제
 *
 */

exports.deleteResumeSkills = async function(req, res) {
    const resumeId= parseInt(req.params.resumeId);
    const skillId = parseInt(req.params.skillId);

    const deleteResumeSkillsParams = [resumeId, skillId]

    console.log(deleteResumeSkillsParams)

    const deleteResumeSkillsResponse = await resumeService.deleteResumeSkills(deleteResumeSkillsParams);

    return res.send(deleteResumeSkillsResponse);
}

/**
 * 이력서 userInfo 수정
 */

exports.patchResumeUserInfo = async function(req, res) {
    const resumeId = req.params.resumeId
    const resumeName = req.body.resumeName
    const userName = req.body.userName
    const userEmail = req.body.userEmail
    const userTel = req.body.userTel
    const selfIntroduction = req.body.selfIntroduction

    const params = [resumeId , resumeName, userName, userEmail,userTel,selfIntroduction]


    const patchResumeUserInfoResponse = await resumeService.patchResumeUserInfo(params);

    return res.send(patchResumeUserInfoResponse);
}