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
