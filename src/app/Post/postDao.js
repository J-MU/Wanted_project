const util = require('util')

//배너 사진 가져오기 3개 가져오기 랜덤으로 배열에 담음
async function getCarousel(connection) {
    console.log("getCarousel에서 죽음?");

    const getCarouselQuery = `
    select imgUrl, title as carouseTitle, content, link
    from Carousel
    where page='MAIN_PAGE'
    order by rand() limit 6;    
    `;

    const carouselRow = await connection.query(getCarouselQuery);
    console.log("getCarousel끝나기 직전");
    return carouselRow[0]
}

//postTags 가져오기
async function getInsitePostTags(connection) {


    const getPostTagsQuery = `
        select tagId,name 
        from postTags
        where tagId<19
        order by rand() limit 9;
    `;
    const PostTagsRow = await connection.query(getPostTagsQuery);
    return PostTagsRow[0];

}

//interestedTags 가져오기
async function getInsitePostInterestedTags(connection, userId) {


    const getInsitePostInterestedTagsQuery = `
        select UPTM.postTagId as tagId, postTags.name as name
        from postTags
                 inner join UserPostTagMapping UPTM on postTags.tagId = UPTM.postTagId
        where userId =?;
    `;
    const PostInterestedTagsRow = await connection.query(getInsitePostInterestedTagsQuery,userId);

    const postTagsRow = PostInterestedTagsRow[0]

    const num = 9-(PostInterestedTagsRow[0].length)

    const getInsitePostTagsQuery = `
        select tagId, name
        from postTags
        where tagId<19 and tagId not in (

            select  UPTM.postTagId
            from postTags
            inner join UserPostTagMapping UPTM on postTags.tagId = UPTM.postTagId
            where userId =1

            )
        order by rand() limit ?;
    `;
    const PostNotInterestedTagsRow = await connection.query(getInsitePostTagsQuery,num);

    for (var i=0; i<PostNotInterestedTagsRow[0].length ;i++) {
        postTagsRow.push(PostNotInterestedTagsRow[0][i])
    }

   return postTagsRow

}

//태그 가져오기 9개. 거기서 첫번째 태그 포스트 9개 넣기.
async function getInsitePosts(connection, tagId) {


    console.log("tagId:",tagId);
    const getInsitePostsQuery = `
    select postThumbnailUrl, postName, postContent, writer, pf.platformImgUrl
    from insitePosts
    inner join platforms as pf on insitePosts.platformId = pf.platformId
    where tagId=?
    limit 4;
    `;

    

    const  getInsitePostsRow = await connection.query(getInsitePostsQuery,tagId);
    return getInsitePostsRow[0];
}


// article 불러오기
async function getArticlePosts(connection, params) {


    const getArticlePostsQuery=`
    select postId, postThumbnailUrl,  postImgUrl, title
    from articlePosts
    inner join articleTagsMapping aTM on articlePosts.postId = aTM.articlePostId
    where tagId =${params[1]}
    order by rand() limit ${params[0]};
    `;
    const [articlePostsRow] = await connection.query(getArticlePostsQuery,params);
    console.log(articlePostsRow)
    var resultRow = [];
    for (var i=0; i<params[0]; i++) {
        var articlePostId = articlePostsRow[i].postId;
        console.log(articlePostId)
        const getArticlePostTagsQuery=`
        select concat("#",name) as name, postTags.tagId
        from postTags
        inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
        where aTM.articlePostId=?;
    `;

        const articleTagsRow = await connection.query(getArticlePostTagsQuery,articlePostId)
        articlePostsRow[i].postTags = articleTagsRow[0];
        resultRow.push(articlePostsRow[i]);
    }
    //console.log(util.inspect(resultRow, {showHidden: false, depth: null,  colors: true}));
    return resultRow

}

//vod 불러오기

async function getVodPosts(connection, params) {


    const getVodPostsQuery = `
    select postId, talkerName, LEFT(title,35) as title, LEFT(subtitle,23) as subtitle, thumnailImgUrl
    from vodPosts
    where tagId=${params[1]}
    order by rand() limit ${params[0]};
    `;

    const vodPostsRow = await connection.query(getVodPostsQuery,params);

    return vodPostsRow[0];
}

async function getPostsByTagId(connection,tagId) {

    const getPostsByTagIdQuery = `
    select postUrl, postThumbnailUrl, postName, postContent, writer, platformImgUrl
    from insitePosts
    inner join platforms as p on p.platformId=insitePosts.platformId
    where tagId=?
    `;

    const getPostsByTagIdRow = await connection.query(getPostsByTagIdQuery,tagId);

    return getPostsByTagIdRow[0];
}


//아티클 포스트 마감순으로 가져오기
async function getArticlePostsByDate (connection) {
    const getArticlePostsByDateQuery = `
        select postId,
               postThumbnailUrl,
               postImgUrl,
               title,
               concat(
                       (date_format(startDate, '%Y.%m.%d ')),
                       case DAYOFWEEK(startDate)
                           when '1' then '(일)'
                           when '2' then '(월)'
                           when '3' then '(화)'
                           when '4' then '(수)'
                           when '5' then '(목)'
                           when '6' then '(금)'
                           when '7' then '(토)'
                           end
                   ,' ~ '
                   ,(date_format(dueDate, '%Y.%m.%d ')),
                       case DAYOFWEEK(dueDate)
                           when '1' then '(일)'
                           when '2' then '(월)'
                           when '3' then '(화)'
                           when '4' then '(수)'
                           when '5' then '(목)'
                           when '6' then '(금)'
                           when '7' then '(토)'
                           end
                   ) as startAndDueDate


        from articlePosts
        where startDate is not null
    `;

    const getPostsByTagIdRow = await connection.query(getArticlePostsByDateQuery);

    const num = getPostsByTagIdRow[0].length
    var resultRow = [];
    for (var i=0; i<num; i++) {
        var articlePostId = getPostsByTagIdRow[0][i].postId;
        const getArticlePostTagsQuery=`
        select concat("#",name) as name, postTags.tagId
        from postTags
        inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
        where aTM.articlePostId=?;
    `;

        const articleTagsRow = await connection.query(getArticlePostTagsQuery,articlePostId)
        getPostsByTagIdRow[0][i].postTags =articleTagsRow[0];
        resultRow.push(getPostsByTagIdRow[0][i]);

    }
    return resultRow
}

//아티클 포스트 by 태그 by 마감임박순
async function getArticlePostsByTagIdAndDate (connection,tagId) {
    console.log(tagId)
    // article 불러오기
    const getArticlePostsByTagIdAndDateQuery=`
    select postId, postThumbnailUrl,  postImgUrl, title,
           concat(
                   (date_format(startDate, '%Y.%m.%d ')),
                   case DAYOFWEEK(startDate)
                       when '1' then '(일)'
                       when '2' then '(월)'
                       when '3' then '(화)'
                       when '4' then '(수)'
                       when '5' then '(목)'
                       when '6' then '(금)'
                       when '7' then '(토)'
                       end
               ,' ~ '
               ,(date_format(dueDate, '%Y.%m.%d ')),
                   case DAYOFWEEK(dueDate)
                       when '1' then '(일)'
                       when '2' then '(월)'
                       when '3' then '(화)'
                       when '4' then '(수)'
                       when '5' then '(목)'
                       when '6' then '(금)'
                       when '7' then '(토)'
                       end
               ) as startAndDueDate
    from articlePosts
    inner join articleTagsMapping aTM on articlePosts.postId = aTM.articlePostId
    where tagId=? and startDate is not null;
    `;

    const getArticlePostsByTagIdAndDateRow = await connection.query(getArticlePostsByTagIdAndDateQuery,tagId);

    // for (var i=0; i<getArticlePostsByTagIdRow[0].length; i++) {
    //     if(getArticlePostsByTagIdRow[0][i].startAndDueDate==null){
    //
    //         getArticlePostsByTagIdRow[0][i].startAndDueDate = '상시'
    //     }
    // }
    //console.log(getArticlePostsByTagIdRow[0])
    var resultRow = [];
    for (var i=0; i<getArticlePostsByTagIdAndDateRow[0].length; i++) {
        var articlePostId = getArticlePostsByTagIdAndDateRow[0][i].postId;
        const getArticlePostTagsQuery=`
        select concat("#",name) as name, postTags.tagId
        from postTags
        inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
        where aTM.articlePostId=?;
    `;

        const articleTagsRow = await connection.query(getArticlePostTagsQuery,articlePostId)
        getArticlePostsByTagIdAndDateRow[0][i].postTags = articleTagsRow[0];
        resultRow.push( getArticlePostsByTagIdAndDateRow[0][i]);
    }
    //console.log(util.inspect(resultRow, {showHidden: false, depth: null,  colors: true}));
    return resultRow
}

// 아티클 포스트 by 태그 , 나머지들
async function getArticlePostsByTagId (connection, tagId) {
    const getArticlePostsByTagIdQuery=`
        select postId, postThumbnailUrl, postImgUrl, title
        from articlePosts
                 inner join articleTagsMapping aTM on articlePosts.postId = aTM.articlePostId
        where tagId=? and (startDate is null) and (dueDate is null);
    `;
    const getArticlePostsByTagIdRow = await connection.query(getArticlePostsByTagIdQuery,tagId);

    for (var i=0; i<getArticlePostsByTagIdRow[0].length; i++) {
        getArticlePostsByTagIdRow[0][i].startAndDueDate = '상시'
        console.log(getArticlePostsByTagIdRow[0]);
    }

    var resultRow = [];
    for (var i=0; i<getArticlePostsByTagIdRow[0].length; i++) {
        var articlePostId = getArticlePostsByTagIdRow[0][i].postId;
        const getArticlePostTagsQuery=`
        select concat("#",name) as name, articlePostId
        from postTags
        inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
        where aTM.articlePostId=?;
    `;

        const articleTagsRow = await connection.query(getArticlePostTagsQuery,articlePostId)
        getArticlePostsByTagIdRow[0][i].postTags = articleTagsRow[0];
        resultRow.push(getArticlePostsByTagIdRow[0][i]);
    }
    //console.log(util.inspect(resultRow, {showHidden: false, depth: null,  colors: true}));
    return resultRow
}


//최신 순으로 전체 조회 가져오기
async function getArticlePostsByCurrent(connection) {
    const  getArticlePostsByCurrentQuery=`
        select postId, postThumbnailUrl, postImgUrl, title,
               concat(
                       (date_format(startDate, '%Y.%m.%d ')),
                       case DAYOFWEEK(startDate)
                           when '1' then '(일)'
                           when '2' then '(월)'
                           when '3' then '(화)'
                           when '4' then '(수)'
                           when '5' then '(목)'
                           when '6' then '(금)'
                           when '7' then '(토)'
                           end
                   ,' ~ '
                   ,(date_format(dueDate, '%Y.%m.%d ')),
                       case DAYOFWEEK(dueDate)
                           when '1' then '(일)'
                           when '2' then '(월)'
                           when '3' then '(화)'
                           when '4' then '(수)'
                           when '5' then '(목)'
                           when '6' then '(금)'
                           when '7' then '(토)'
                           end
                   ) as startAndDueDate
        from articlePosts
        order by publishedDate desc
    `;
    const  getArticlePostsByCurrentRow = await connection.query( getArticlePostsByCurrentQuery);

    for (var i=0; i<getArticlePostsByCurrentRow[0].length; i++) {
        if(getArticlePostsByCurrentRow[0][i].startAndDueDate==null)
        getArticlePostsByCurrentRow[0][i].startAndDueDate = '상시'
    }

    var resultRow = [];
    for (var i=0; i<getArticlePostsByCurrentRow[0].length; i++) {
        var articlePostId = getArticlePostsByCurrentRow[0][i].postId;
        const getArticlePostTagsQuery=`
        select concat("#",name) as name, articlePostId
        from postTags
        inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
        where aTM.articlePostId=?;
    `;

        const articleTagsRow = await connection.query(getArticlePostTagsQuery,articlePostId)
        getArticlePostsByCurrentRow[0][i].postTags = articleTagsRow[0];
        resultRow.push(getArticlePostsByCurrentRow[0][i]);
    }
    //console.log(util.inspect(resultRow, {showHidden: false, depth: null,  colors: true}));
    return resultRow


}

//아티클 눌렀을 때 전체 조회

async function getArticlePostDetails (connection, postId) {
    const getArticlePostDetailsQuery = `
        select D.content, D.videoContent, D.writer, date_format(D.createdAt, '%Y.%m.%d') as createdAt
        from articlePostDetails as D
        where postId=?;
    `;
    const  getArticlePostDetailsRow = await connection.query(getArticlePostDetailsQuery,postId);

    return getArticlePostDetailsRow[0];
}

async function getArticlePostImg (connection, postId) {
    const getArticlePostImgQuery= `
            select imgUrl
            from articlePostImg
            where postId=?
    `
    const  getArticlePostImgRow = await connection.query(getArticlePostImgQuery,postId);

    return getArticlePostImgRow[0]
}

async function getArticleTag (connection, postId) {
    const getArticleTagQuery= `
            select tagId
            from articleTagsMapping
            where articlePostId=?
            order by rand() limit 1 
    `
    const  getArticleTagRow = await connection.query(getArticleTagQuery,postId);
    return getArticleTagRow[0][0].tagId
}

//탑텐 가져오기
async function getTopTenContents (connection) {
    const getTopTenContentsQuery= `
        select postId, talkerName, title, subtitle, thumnailImgUrl, contentSummary,
               case when left(totalTime ,2)='00' then (date_format(totalTime,'%i:%s'))
                else totalTime
        end as time
        from vodPosts
        order by count desc limit 5;
    `
    const  getTopTenContentsRow = await connection.query(getTopTenContentsQuery);
    return getTopTenContentsRow[0]
}

//vod포스트 가져오기
async function getVodPostsByTags (connection,vodTagId) {
    const getVodPostsByTagsQuery= `
        select postId, talkerName, title, subtitle, thumnailImgUrl, contentSummary,
               case when left(totalTime ,2)='00' then (date_format(totalTime,'%i:%s')) 
                else totalTime
                end as time
        from vodPosts
        where tagId=? 
        order by rand() limit 5;
    `
    const  getVodPostsByTagsRow = await connection.query(getVodPostsByTagsQuery,vodTagId);
    return getVodPostsByTagsRow[0]
}





module.exports = {
    getCarousel,
    getInsitePostTags,
    getInsitePosts,
    getArticlePosts,
    getVodPosts,
    getInsitePostInterestedTags,
    getPostsByTagId,
    getArticlePostsByDate,
    getArticlePostsByTagIdAndDate,
    getArticlePostsByTagId,
    getArticlePostsByCurrent,
    getArticlePostDetails,
    getArticlePostImg,
    getArticleTag,
    getTopTenContents,
    getVodPostsByTags

};

