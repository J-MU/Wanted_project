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

    return res.send(getCompaniesResponse);
}