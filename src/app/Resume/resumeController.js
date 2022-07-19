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