const { application } = require('express');

module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest)

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. 회원가입(2페이지) 
    app.post('/app/job',user.postJobCatgory);

    // 3. 회원가입(3페이지) Default Resume 생성.
    app.post('/app/users/post-default-resume',jwtMiddleware,user.postDefaultResume);  //바뀜

    // 관심태그 설정 API
    app.post('/app/users/interestedTags',user.postInterestedTags);
   
    // 3. 특정 유저 조회 API
    //app.get('/app/users/:userId', user.getUserById);

    // 4. 북마크 등록 API
    app.post('/app/test/users/bookmark',jwtMiddleware,user.postBookMark);

    // 5. 좋아요 등록 API
    app.post('/app/users/heart',jwtMiddleware,user.postHeart);

    // 6. 회사 Follow API
    app.post('/app/users/follow',jwtMiddleware,user.postFollow);

    //7. 북마크 해제 API
    app.patch('/app/users/:userId/employments/:employmentId/bookmark/status',jwtMiddleware,user.deleteBookMark);

    //8. 좋아요 취소 API
    app.patch('/app/users/:userId/employments/:employmentId/heart/status',jwtMiddleware,user.deleteHeart);

    //9. Follow 취소 API
    app.patch('/app/users/:userId/companies/:companyId/follow/status',jwtMiddleware,user.deleteFollow);

    //10. 회원여부 체크 API
    app.get('/app/users/is-member/:email',user.isMember);
    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
  //  app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

    // 11. user Profile 조회 API
    app.get('/app/users/:userId/profile',jwtMiddleware,user.getProfileData);
  
    // 12. user Profile Img 등록 API
    app.patch('/app/profile/profileImg',jwtMiddleware,user.patchProfileImg);

    // 13. user Profile 수정 API
    app.put('/app/users/:userId/profile',jwtMiddleware,user.patchProfile);

    // 14. user 기본정보 확인 API
    app.get('/app/users/:userId',jwtMiddleware,user.getUserInfo);
    // 15. user Profile spec 수정 API
    app.put('/app/users/:userId/profile/spec',jwtMiddleware,user.patchProfileSpec);

    // 16. 회사에 이력서 지원.
    app.post('/app/application',jwtMiddleware,user.postApplication);

    // 17. 이력서 지원 취소
    app.patch('/app/application/status',jwtMiddleware,user.cancleApplication);
  };


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API

//app.get('/app/auto-login', jwtMiddleware, user.check);

/*app.get('/app/auto-login', jwtMiddleware, user.check);*/


// TODO: 탈퇴하기 API