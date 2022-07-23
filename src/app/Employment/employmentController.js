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
    params.userId=0;
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
    
    

    const locationRegex=new RegExp('.\..'); // sdf.dsfsd 형태 (city.region)
   
    if(req.query.location && !locationRegex.test(req.query.location)){
        return response(baseResponse.SEARCH_LOCATION_ERROR_TYPE);
    }
    if(req.query.location){
        const location=req.query.location.split('.');
        params.city=location[0];
        params.region=location[1];
    }
        
        
    if(req.query.companyTagId)  //TODO companyTagList가 length가 3이하인지 validation해야함.
        params.companyTagId=req.query.companyTagId;
    if(req.query.career)
        params.career=req.query.career;
    if(req.query.skillTagId)    //ok~
        params.skills=req.query.skillTagId;
    if(req.query.orderBy)
        params.orderBy=req.query.orderBy;

    console.log(params);

    const EmploymentsRow=await employmentProvider.getEmployments(params);

    return res.send(response(baseResponse.SUCCESS,EmploymentsRow));
}



exports.getEmploymentPostData = async function (req, res) {    //TODO 로그인이 되어있는 경우 고려해야함.
    let userId=0;
    console.log("천제제: 천재 제제 ? 천사 제제?");
    console.log(isNaN(req.params.employmentId));
    console.log("?");
    if(isNaN(req.params.employmentId))
      {
        return res.send(response(baseResponse.EMPLOYMENT_ID_EMPTY));
      }

    if(req.verifiedToken){
        userId = req.verifiedToken.userId
    }
    const employmentId=req.params.employmentId;

    
    const EmploymentPostData=await employmentProvider.getEmploymentPostData(employmentId,userId);

    return res.send(response(baseResponse.SUCCESS,EmploymentPostData));
}

exports.getEmploymentsHavingHeart = async function (req, res) {
    let userId;

    console.log("천사였네!");
    if(req.verifiedToken){
        userId = req.verifiedToken.userId;
    }

    const companyRows = await employmentProvider.getEmploymentsHavingHeart(userId);

    return res.send(companyRows);
}


exports.getEmploymentsHavingBookMark = async function (req, res) {
    let userId;

    console.log("천사였네!");
    if(req.verifiedToken){
        userId = req.verifiedToken.userId;
    }
    
    const employmentRows = await employmentProvider.getEmploymentsHavingBookMark(userId);

    return res.send(employmentRows);
}