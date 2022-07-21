// 모든 유저 조회
async function getPostTags(connection) {
    const getPostTagsQuery = `
        select tagId,name from postTags
        where postTags.region%2=0;
                  `;
    const PostTagsRow = await connection.query(getPostTagsQuery);
    return PostTagsRow;
  }
  

  module.exports = {
    getPostTags,
  };
  