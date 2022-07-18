module.exports = function(app){
    const job = require('./jobController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 직군에 따른 직무 조회 API
    app.get('/app/jobgroup/:jobgroupid/jobcategories',job.getJobCategories);


};

