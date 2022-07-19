module.exports = function(app) {
    const resume = require('./resumeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    //이력서 전체 조회
    app.get('/app/resumes', resume.getResumes);

};
