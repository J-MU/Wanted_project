module.exports = function(app){
    const employment = require('./employmentController');
    const jwtMiddleware = require('../../../config/jwtMiddleWareIsNotLoginOk');
    const jwtMiddlewareMustLogin = require('../../../config/jwtMiddleWare');
    

    // 채용 메인 페이지 조회
    app.get('/app/employment/mainpage',jwtMiddleware,employment.getDataForMainPage);
 
    // 전체 채용 필터링 조회
    app.get('/app/employments',jwtMiddleware,employment.getEmployments);

    
    // 좋아요 누른 채용공고 조회
    app.get('/app/employments/heart',jwtMiddlewareMustLogin,employment.getEmploymentsHavingHeart); 

    // 북마크 누른 채용공고 조회
    app.get('/app/employments/bookmark',jwtMiddlewareMustLogin,employment.getEmploymentsHavingBookMark);
    
    // 채용 상세 페이지 조회
    app.get('/app/employments/:employmentId',jwtMiddleware,employment.getEmploymentPostData);

    // 회사 상세페이지에서 회사에서 채용중인 employment 조회(처음 4개 제외)
    app.get('/app/companies/:companyId/employments',jwtMiddleware,employment.getEmploymentsUsingCompanyId);
    
    
    
};

