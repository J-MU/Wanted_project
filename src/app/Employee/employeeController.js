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
 exports.getEmployeeAnalysis = async function (req, res) {    
    console.log("Run Controller");
    let employeeAnalysis;

    const period=req.query.period;
    const type=req.query.type;
    const companyId=req.params.companyId;
    if(!period) return res.send(errResponse(baseResponse.ANALYSIS_PERIOD_EMPTY));
    if(!type) return res.send(errResponse(baseResponse.ANALYSIS_TYPE_EMPTY));
    if(!companyId) return res.send(errResponse(baseResponse.COMPANY_EMPTY));
    if(period<1 || period>3) return res.send(errResponse(baseResponse.ANALYSIS_PERIOD_INVALIABLE));
    if(type<1 || type>3) return res.send(errResponse(baseResponse.ANALYSIS_TYPE_INVALIABLE));
    try{
        employeeAnalysis=await employeeProvider.getAnalysisEmployee(period,type,companyId);
    }catch(err){
        if(err=="getAnalysisTotalEmployeesFail") return res.send(response(errResponse({"isSuccess":false,"code":4001,"message":"fail getAnalysisTotalEmployees Query"})));
        if(err=="getAnalysisEntrantEmployeesFail") return res.send(response(errResponse({"isSuccess":false,"code":4002,"message":"fail getAnalysisEntrantEmployees Query"})));
        if(err=="getAnalysisRetireeEmployeesFail") return res.send(response(errResponse({"isSuccess":false,"code":4003,"message":"fail getAnalysisRetireeEmployees Query"})));
    }
    
    return res.send(response(baseResponse.SUCCESS,employeeAnalysis))
}