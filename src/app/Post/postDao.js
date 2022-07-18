const util = require('util')

//홈 화면 조회
async function selectPosts(connection) {
    //

    // article 불러오기
    const getArticlePostsQuery=`
    select postId, postThumbnailUrl, title, contentDirectoryRoute
    from articlePosts
    order by rand() limit 4;
    `;
    const [articlePostsRow] = await connection.query(getArticlePostsQuery);
    var resultRow = [];
    for (var i=0; i<3; i++) {
        var articlePostId = articlePostsRow[i].postId;
        const getArticlePostTagsQuery=`
        select name, articlePostId
        from postTags
        inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
        where aTM.articlePostId=?;
    `;

        const [articleTagsRow] = await connection.query(getArticlePostTagsQuery,articlePostId)
        articlePostsRow[i].postTags = articleTagsRow;
        resultRow.push(articlePostsRow[i]);
        // console.log(resultRow);
    }

    console.log(util.inspect(resultRow, {showHidden: false, depth: null, colors: true}));

    //vod 불러오기

    const getVodPostsQuery = `
    select postId, talkerName, LEFT(title,35), LEFT(subtitle,23), thumnailImgUrl, contentSummary
    from vodPosts
    order by rand() limit 4;
    `;

    const [vodPostsRow] = await connection.query(getVodPostsQuery);



}


module.exports = {
    selectPosts
};
