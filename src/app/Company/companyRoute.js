
module.exports = function(app) {
    const company = require('./companyController');
    const jwtMiddleware = require('../../../config/jwtMiddleWareIsNotLoginOk');

    //회사 검색 API
    app.get('/app/companies', company.getCompanies);

    app.get('/app/companyTag/:companyTagId/companies',jwtMiddleware,company.getCompaniesUsingTag);

}