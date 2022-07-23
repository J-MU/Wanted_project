module.exports = function(app){
    const service = require('./service');
    

    // 채용 메인 페이지 조회
    app.post('/app/dummy/companies',service.postDummyData);
 
    app.post('/app/dummy/employee/fired',service.firedDummy);
};

