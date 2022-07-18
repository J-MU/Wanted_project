module.exports = function(app){
    const skill = require('./skillController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 직군에 따른 직무 조회 API
    app.get('/app/skills/:skillname',skill.getSkills);


};

