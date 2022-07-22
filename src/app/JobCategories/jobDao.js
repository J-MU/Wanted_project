// 모든 유저 조회
async function getJobCategories(connection,jobGroupId) {
    const getJobCategoriesQuery = `
             select categoryId,name 
             from JobCategories 
             where jobGroupCategoryId=${jobGroupId};
                  `;
    const jobCategoryRows = await connection.query(getJobCategoriesQuery);
    return jobCategoryRows;
}

async function getJobGroupCategories(connection) {
  const getJobCategoriesQuery = `
           select jobGroupCategoryId,name
           from JobGroupCategories 
                `;
  const jobCategoryRows = await connection.query(getJobCategoriesQuery);
  return jobCategoryRows;
}

async function getJobNameByJobId(connection,jobId) {
  const getJobCategoriesQuery = `
          select name 
          FROM JobCategories
           where categoryId=${jobId};
                `;
  const jobCategoryRows = await connection.query(getJobCategoriesQuery);
  return jobCategoryRows[0];
}

async function getJobGroupCategoryId(connection,jobId) {
  const getJobCategoriesQuery = `
          select jobGroupCategoryId 
          FROM JobCategories
          where categoryId=${jobId};
                `;
  const jobCategoryRows = await connection.query(getJobCategoriesQuery);
  return jobCategoryRows[0];
}

  module.exports = {
    getJobCategories,
    getJobGroupCategories,
    getJobNameByJobId,
    getJobGroupCategoryId,
  };
  