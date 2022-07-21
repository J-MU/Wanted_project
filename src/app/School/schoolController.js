const jwtMiddleware = require("../../../config/jwtMiddleware");
const schoolProvider = require("../../app/School/schoolProvider");
const schoolService = require("../../app/School/schoolService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");
const resumeProvider = require("../Resume/resumeProvider");

/**
 * 학교 검색
 * [get] /app/schools
 */

exports.getSchools =  async function (req, res) {
    const schoolName = req.body.schoolName;

    if(!schoolName) return res.send(response(baseResponse.SCHOOLNAME_EMPTY));
    const getSchoolsResponse = await schoolProvider.getSchools(schoolName);

    return res.send(getSchoolsResponse);
}
