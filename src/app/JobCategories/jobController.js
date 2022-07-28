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
    const jobGroupId=req.params.jobgroupid; 

    const checkJobGroupIdValidable=await jobProvider.checkJobGroupIdValidable(jobGroupId);
    if(checkJobGroupIdValidable.length<=0)
        return res.send(errResponse(baseResponse.UNVALIDABLE_JOB_GROUP_ID));
        
    const matchingJobCategories=await jobProvider.getJobCategories(jobGroupId);
    
    return res.send(response(baseResponse.SUCCESS,matchingJobCategories))
}

exports.getJobGroupCategories=async function(req,res){
    const JobGroupCategories=await jobProvider.getJobGroupCategories();

    return res.send(response(baseResponse.SUCCESS,JobGroupCategories));
}
