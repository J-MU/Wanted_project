const jwtMiddleware = require("../../../config/jwtMiddleware");
const jobProvider = require("../../app/JobCategories/jobProvider");
const jobService = require("../../app/JobCategories/jobService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getJobCategories = async function (req, res) {
    const jobGroupId=req.params.jobgroupid; //TODO jobGroupId 가 유효한지 validation

    const matchingJobCategories=await jobProvider.getJobCategories(
        jobGroupId
    );
    
    return res.send(response(baseResponse.SUCCESS,matchingJobCategories))
}

exports.getJobGroupCategories=async function(req,res){
    const JobGroupCategories=await jobProvider.getJobGroupCategories();

    return res.send(response(baseResponse.SUCCESS,JobGroupCategories));
}
