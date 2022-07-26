const user = require("../User/userController");
const post = require("./postController");
module.exports = function(app){
    const post = require('./postController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const jwtMiddleWareIsNotLoginOk = require('../../../config/jwtMiddleWareIsNotLoginOk');

    // 홈 화면 가져오기
    app.get('/app/posts', jwtMiddleWareIsNotLoginOk, post.getPosts);

    // 인사이트 태그 누를 때마다 다른 거
    app.get('/app/posts/insitePostTags', post.getPostsByTagId); // localhost:3000/app/posts/insitePostTags?tagId=1

    // 아티클 post 전체보기
    app.get('/app/posts/article', post.getArticlePosts);

    //아티클 태그 누를 때마다 다른 거
    app.get('/app/posts/articlePostTags', post.getArticlePostsByTagId) // localhost:3000/app/posts/insitePostTags?tagId=1

    //아티클 자세히 보기
    app.get('/app/posts/articlePost/details', post.getArticlePostDetails)

    //vod post 전체보기
    app.get('/app/posts/vod', post.getVodPosts); // /app/posts/vod?tagId=

};

