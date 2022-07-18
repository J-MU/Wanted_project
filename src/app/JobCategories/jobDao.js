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
  
async function getSkills(connection) {
    const getSkillsQuery = `
            select skillId,name from Skills;
                    `;
    const skillRows = await connection.query(getSkillsQuery);
    return skillRows;
}

  module.exports = {
    getJobCategories,
    getSkills,
  };
  