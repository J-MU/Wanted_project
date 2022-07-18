//홈 화면 조회
async function selectPosts(connection) {

    const getArticlePostsQuery=`
    select postId, postThumbnailUrl, title, contentDirectoryRoute
    from articlePosts
    order by rand() limit 4;
    `;
    const articlePostsRow = await connection.query(getArticlePostsQuery);

    let articlePostId=articlePostsRow[postId];
    console.log(articlePostId);
    /*const getArticlePostTagsQuery=`
    select name
    from postTags
    inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
    where aTM.articlePostId=?;
    `;

    const articleTagsRow = await connection.query(getArticlePostTagsQuery,articlePostId )*/

}


module.exports = {
    selectPosts
};
