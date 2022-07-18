const jwtMiddleware = require("../../../config/jwtMiddleware");
const skillProvider = require("../../app/Skill/skillProvider");
const skillService = require("../../app/Skill/skillService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getSkills = async function (req, res) {
    const skillName=req.params.skillname; 
    console.log(skillName);
    
    const Skills=await skillProvider.getSkills(
        skillName
    );
    
    return res.send(response(baseResponse.SUCCESS,Skills))
}
