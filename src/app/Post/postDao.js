const util = require('util')
const {errResponse} = require("../../../config/response");

//배너 사진 가져오기 3개 가져오기 랜덤으로 배열에 담음
async function getCarousel(connection) {
    var carouselRow
    try {
        const getCarouselQuery = `
            select imgUrl, title as carouseTitle, content, link
            from Carousel
            where page = 'MAIN_PAGE'
            order by rand() limit 6;
        `;

       carouselRow = await connection.query(getCarouselQuery);
    }
    catch(err) {
        throw "carousel Query err"
    }
    return carouselRow[0]
}

//postTags 가져오기
async function getInsitePostTags(connection) {
    var PostTagsRow
try {
    const getPostTagsQuery = `
        select tagId, name
        from postTags
        where tagId < 19
        order by rand() limit 9;
    `;
    PostTagsRow = await connection.query(getPostTagsQuery);
}
catch(err) {
    throw "insitePostTags Query err"
}

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
var getInsitePostsRow
try {
    console.log("tagId:", tagId);
    const getInsitePostsQuery = `
        select postThumbnailUrl, postName, postContent, writer, pf.platformImgUrl
        from insitePosts
                 inner join platforms as pf on insitePosts.platformId = pf.platformId
        where tagId = ? limit 4;
    `;


    getInsitePostsRow = await connection.query(getInsitePostsQuery, tagId);
}
catch(err) {
    throw "insitePosts Query err"
}

    return getInsitePostsRow[0];
}


// article 불러오기
async function getArticlePosts(connection, params) {
    let articlePostsRow
    let resultRow = [];
    let articleTagsRow
    try {
        const getArticlePostsQuery = `
            select postId, postThumbnailUrl, postImgUrl, title
            from articlePosts
                     inner join articleTagsMapping aTM on articlePosts.postId = aTM.articlePostId
            where tagId = ${params[1]}
              and startDate is null
            order by rand() limit ${params[0]};
        `;
        [articlePostsRow] = await connection.query(getArticlePostsQuery, params);
    }
catch(err) {
        throw "articlePosts Query err"
} try {
        for (let i = 0; i < [articlePostsRow].length ; i++) {
            let articlePostId = articlePostsRow[i].postId;
            const getArticlePostTagsQuery = `
                select concat("#", name) as name, postTags.tagId
                from postTags
                         inner join articleTagsMapping as aTM on postTags.tagId = aTM.tagId
                where (aTM.articlePostId = ${articlePostId});
            `;

            console.log(i,getArticlePostTagsQuery)
            articleTagsRow = await connection.query(getArticlePostTagsQuery, articlePostId)
            articlePostsRow[i].postTags = articleTagsRow[0];
            resultRow.push(articlePostsRow[i]);
        }
    }
    catch(err) {
        throw "articlePostTags Query err"
    }
    //console.log(util.inspect(resultRow, {showHidden: false, depth: null,  colors: true}));
    return resultRow

}

//vod 불러오기

async function getVodPosts(connection, params) {
let vodPostsRow
try {
    const getVodPostsQuery = `
        select postId, talkerName, LEFT (title, 35) as title, LEFT (subtitle, 23) as subtitle, thumnailImgUrl
        from vodPosts
        where tagId=${params[1]}
        order by rand() limit ${params[0]};
    `;

    vodPostsRow = await connection.query(getVodPostsQuery, params);
}
catch(err){
    throw "vodPosts Query err"
}
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
    let getArticlePostDetailsRow
    try {
        console.log("여기" ,postId)
        const getArticlePostDetailsQuery = `
            select D.content, D.videoContent, D.writer, date_format(D.createdAt, '%Y.%m.%d') as createdAt
            from articlePostDetails as D
            where postId = ${postId};
        `;
        console.log(getArticlePostDetailsQuery)
       getArticlePostDetailsRow = await connection.query(getArticlePostDetailsQuery, postId);
    }
    catch(err) {
        throw "getArticlePostDetails Query err"
    }
    return getArticlePostDetailsRow[0];
}

async function getArticlePostImg (connection, postId) {
    let getArticlePostImgRow
    try {
        const getArticlePostImgQuery = `
            select imgUrl
            from articlePostImg
            where postId = ?
        `
        getArticlePostImgRow = await connection.query(getArticlePostImgQuery, postId);
    }
    catch(err){
        throw "getArticleImg Query err"
    }
    return getArticlePostImgRow[0]
}

async function getArticleTag (connection, postId) {
    let getArticleTagRow
    try {
        const getArticleTagQuery = `
            select tagId
            from articleTagsMapping
            where articlePostId = ?
            order by rand() limit 1
        `
        getArticleTagRow = await connection.query(getArticleTagQuery, postId);
    }
    catch(err) {
        throw "getArticleTag Query err"
    }
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

//postId 체크

async function postIdCheck (connection, postId) {
    const postIdCheckQuery= `
        select postId
        from articlePosts
        where postId=? 
    `
    const  postIdCheckRow = await connection.query(postIdCheckQuery,postId);
    console.log(postIdCheckRow[0])
    return postIdCheckRow[0]
}

//tagIdCheck

async function vodTagCheck (connection, tagId) {
    const vodTagCheckQuery= `
        select tagId
        from postTags
        where tagId=? 
    `
    const vodTagCheckRow = await connection.query(vodTagCheckQuery,tagId);
    console.log(vodTagCheckRow[0])
    return vodTagCheckRow[0]
}

async function tagIdCheck(connection, tagId) {
    const tagIdCheckQuery= `
        select tagId
        from postTags
        where tagId=? 
    `
    const tagIdCheckRow = await connection.query(tagIdCheckQuery,tagId);

    return tagIdCheckRow[0]
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
    getVodPostsByTags,
    postIdCheck,
    vodTagCheck,
    tagIdCheck

};

