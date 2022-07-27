const jwtMiddleware = require("../../../config/jwtMiddleware");
const companyProvider = require("../../app/Company/companyProvider");
const companyService = require("../../app/Company/companyService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const {emit} = require("nodemon");

exports.gethoho = async function(req, res) {
    res.send('hoho');
}
/**
 * 회사 검색
 * [GET] /app/companies
 */

exports.getCompanies = async function (req, res) {

    const getCompaniesResponse = await companyProvider.getCompanies();

    return res.send(response(baseResponse.SUCCESS,getCompaniesResponse))
}

/**
 * 태그를 통해 회사목록 검색 API
 * [GET] /app/companyTag/:companyTagId/companies
 */
exports.getCompaniesUsingTag = async function (req, res) {
    let userId=0;

    if(req.verifiedToken){
        userId = req.verifiedToken.userId;
    }

    console.log("parmas::?");
    console.log(req.params);
    console.log(req.params.companyTagId);
    if(!req.params || !req.params.companyTagId)
        return res.send(response(baseResponse.COMPANY_TAG_EMPTY));
    
    const companyTagId=req.params.companyTagId;

    const companyRows = await companyProvider.getCompaniesUsingTag(companyTagId,userId);

    return res.send(companyRows);
}

exports.getCompanyDetails = async function (req, res) {
    let userId=0;

    if(req.verifiedToken){
        userId = req.verifiedToken.userId;
    }
    const companyId=req.params.companyId;
    if(!companyId) return res.send(errResponse(baseResponse.COMPANY_EMPTY));
    
    const getCompanyDetails = await companyProvider.getCompanyDetails(userId,companyId);

    return res.send(getCompanyDetails);
}

