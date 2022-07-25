module.exports = function(app){
    const employee = require('./employeeController');
    //const jwtMiddleware = require('../../../config/jwtMiddleWareIsNotLoginOk');
    
    // 채용 메인 페이지 조회
    app.get('/app/company/:companyId/anaylisis',employee.getEmployeeAnalysis);

    
};

