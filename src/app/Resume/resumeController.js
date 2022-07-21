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
 * 이력서 회사 검색
 * [GET] /app/resumes/career/companies
 */

exports.getCareerCompanies = async function (req, res) {
    const companyName = req.body.companyName

    if(!companyName) return res.send(response(baseResponse.COMPANYNAME_EMPTY));
    const getCareerCompaniesResponse = await resumeProvider.getCareerCompanies(companyName);

    return res.send(getCareerCompaniesResponse);
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