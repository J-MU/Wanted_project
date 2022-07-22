const jwtMiddleware = require("../../../config/jwtMiddleware");
const employmentProvider = require("../../app/Employment/employmentProvider");
const employmentService = require("../../app/Employment/employmentService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getDataForMainPage = async function (req, res) {    //TODO 로그인이 되어있는 경우 고려해야함.
    console.log("여기까지 왔나?999");
    let userId=0;
    console.log(userId);
    if(req.verifiedToken){
        userId = req.verifiedToken.userId
    }
        

    const forMainPageData=await employmentProvider.getDataForMainPage(userId);
    
    return res.send(response(baseResponse.SUCCESS,forMainPageData))
}

exports.getEmployments = async function (req, res) {    //TODO 로그인이 되어있는 경우 고려해야함.
    const params={};

    console.log("여기까지 왔나?999");
    
    if(req.verifiedToken){
        params.userId = req.verifiedToken.userId
    }
    console.log("req.query");
    console.log(req.query);
    /*
        header: jwt VerifiedToken O
        Query String: 
                      jobGroupId,
                      jobId,country,
                      location(city.region),
                      companytagId(최대3개),
                      skillTagId,
                      career,
                      orderBy
    */
    if(req.query.jobGroupId)
        params.jobGroupId=req.query.jobGroupId;
    if(req.query.jobId)
        params.jobId=req.query.jobId;
    if(req.query.country)
        params.country=req.query.country;
    if(req.query.location)
        params.location=req.query.location; //TODO LOCATION세분화 해야함.
    if(req.query.companyTagId)
        params.companyTagId=req.query.companyTagId;
    if(req.query.career)
        params.career=req.query.career;
    if(req.query.skillTagId)
        params.skills=req.query.skillTagId;
    if(req.query.orderBy)
        params.orderBy=req.query.orderBy;

    console.log(params);

    return res.send(response(baseResponse.SUCCESS));
}
