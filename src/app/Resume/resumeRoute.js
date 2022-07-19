const jwtMiddleware = require("../../../config/jwtMiddleware");
const resume = require("./resumeController");
module.exports = function(app) {
    const resume = require('./resumeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    //이력서 전체 조회
    app.get('/app/resumes', jwtMiddleware, resume.getResumes);

    //이력서 삭제
    app.patch('/app/resumes/:resumeId/deleted',jwtMiddleware, resume.deleteResumes);

    //이력서 생성
//    app.post('/app/resumes',  jwtMiddleware, resume.postResumes);

};
