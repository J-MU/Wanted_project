const user = require("../User/userController");
module.exports = function(app){
    const post = require('./postController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 홈 화면 가져오기
    app.get('/app/posts', post.getPosts);

    //TODO 무한 스크롤

    // 아티클 post 전체보기
    app.get('/app/posts/article', post.getArticlePosts);

};