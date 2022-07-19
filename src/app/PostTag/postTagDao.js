// 모든 유저 조회
async function getPostTags(connection,jobGroupId) {
    const getPostTagsQuery = `
            select tagId,name from postTags;
                  `;
    const PostTagsRow = await connection.query(getPostTagsQuery);
    return PostTagsRow;
  }
  

  module.exports = {
    getPostTags,
  };
  