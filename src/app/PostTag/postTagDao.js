// 모든 유저 조회
async function getPostTags(connection) {
    const getTag1Query = `
        select tagId,name from postTags
        where postTags.region%2=0 and interestedTagSetting='직장인 공감';
                  `;
    
    const getTag2Query = `
        select tagId,name from postTags
        where postTags.region%2=0 and interestedTagSetting='관심분야';
          `;
        
    const getTag3Query = `
          select tagId,name from postTags
          where postTags.region%2=0 and interestedTagSetting='트렌트/인사이트';
    `;

  
    const tag1 = await connection.query(getTag1Query);
    const tag2 = await connection.query(getTag2Query);
    const tag3 = await connection.query(getTag3Query);

    const PostTagsRow={};
    PostTagsRow.officeWorkerEmpathy=tag1[0];
    PostTagsRow.interests=tag2[0]
    PostTagsRow.trend=tag3[0];
    
    
    return PostTagsRow;
  }
  

  module.exports = {
    getPostTags,
  };
  