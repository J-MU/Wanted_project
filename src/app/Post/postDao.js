const util = require('util')

async function getCarousel(connection) {
    //배너 사진 가져오기 3개 가져오기 랜덤으로 배열에 담음
    const getCarouselQuery = `
    select imgUrl, title as carouseTitle, content, link
    from carousel
    order by rand() limit 3;    
    `;

    const carouselRow = await connection.query(getCarouselQuery);
    return carouselRow[0]
}

async function getInsitePosts(connectionA) {
    //postTags 가져오기

    const getPostTagsQuery = `
        select tagId, name 
        from postTags
        where tagId<19
        order by rand() limit 8;
    `;

    const [postTagsRow] = await connectionA.query(getPostTagsQuery);
    const tagId = postTagsRow[0].tagId;

    //태그 가져오기 9개. 거기서 첫번째 태그 포스트 9개 넣기.

    const getInsitePostsQuery = `
    select postThumbnailUrl, postName, postContent, writer, pf.platformImgUrl
    from insitePosts
    inner join platforms as pf on insitePosts.platformId = pf.platformId
    where tagId=3
    limit 4;
    `;

    const  getInsitePostsRow = await connectionA.query(getInsitePostsQuery,tagId);
    return getInsitePostsRow[0].concat(postTagsRow);
}

async function getArticlePosts(connectionB) {

    // article 불러오기
    const getArticlePostsQuery=`
    select postId, postThumbnailUrl, title
    from articlePosts
    order by rand() limit 4;
    `;
    const [articlePostsRow] = await connectionB.query(getArticlePostsQuery);

    var resultRow = [];
    for (var i=0; i<4; i++) {
        var articlePostId = articlePostsRow[i].postId;
        const getArticlePostTagsQuery=`
        select name, articlePostId
        from postTags
        inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
        where aTM.articlePostId=?;
    `;

        const articleTagsRow = await connectionB.query(getArticlePostTagsQuery,articlePostId)
        articlePostsRow[i].postTags = articleTagsRow[0];
        resultRow.push(articlePostsRow[i]);
    }
    //console.log(util.inspect(resultRow, {showHidden: false, depth: null,  colors: true}));
    return resultRow

}

async function getVodPosts(connectionC) {
    //vod 불러오기

    const getVodPostsQuery = `
    select postId, talkerName, LEFT(title,35) as title, LEFT(subtitle,23) as subtitle, thumnailImgUrl
    from vodPosts
    order by rand() limit 4;
    `;

    const vodPostsRow = await connectionC.query(getVodPostsQuery);

    return vodPostsRow[0];
}



module.exports = {
    getCarousel,
    getInsitePosts,
    getArticlePosts,
    getVodPosts
};
