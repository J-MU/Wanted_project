module.exports = function(app){
    const employment = require('./employmentController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 직군에 따른 직무 조회 API
    app.get('/app/employment/mainpage',employment.getDataForMainPage);

};

