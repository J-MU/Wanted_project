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
