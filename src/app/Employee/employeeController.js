const jwtMiddleware = require("../../../config/jwtMiddleware");
const employeeProvider = require("../Employee/employeeProvider");
//const employeeService = require("../../app/Employment/employeeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");


/**
 * API No. 1
 * API Name : 직원 분석 API
 * [GET] /app/company/:companyId/anaylisis?period=&type=
 */
 exports.getEmployeeAnalysis = async function (req, res) {    //TODO 로그인이 되어있는 경우 고려해야함.
    console.log("Run Controller");
    // TODO period와 type validation

    const period=req.query.period;
    const type=req.query.type;
    const companyId=req.params.companyId;

    const employeeAnalysis=await employeeProvider.getAnalysisEmployee(period,type,companyId);
    
    return res.send(response(baseResponse.SUCCESS,employeeAnalysis))
}