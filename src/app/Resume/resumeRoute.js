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
    app.post('/app/resumes',  jwtMiddleware, resume.postResumes);

    //이력서 조회
    app.get('/app/resumes/:resumeId',  jwtMiddleware, resume.getResume );

    //이력서 이름 가져오기
    app.get('/app/resumes/:resumeId/title',jwtMiddleware, resume.getResumeTitle );

    //이력서 제목 수정하기
    app.patch('/app/resumes/:resumeId/title', jwtMiddleware, resume.patchResumeTitle );

    //이력서 경력 추가하기
    app.post('/app/resumes/:resumeId/career', jwtMiddleware, resume.postResumeCareer);


    //이력서 회사 삭제
    app.patch('/app/resumes/career/:careerId/deleted',jwtMiddleware, resume.deleteResumeCareer);

    //이력서 학교 조회
    app.get('/app/resumes/education/school', resume.getEducationSchool);

    //이력서 학교 추가
    app.post('/app/resumes/:resumeId/education/school',jwtMiddleware, resume.postEducationSchool );

    //이력서 학교 삭제
    app.patch('/app/resumes/education/:educationId/deleted',jwtMiddleware, resume.deleteResumeEducation);
};
