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
  
async function getSkillsAll(connection) {
    const getSkillsQuery = `
            select skillId,name from Skills;
                    `;
    const skillRows = await connection.query(getSkillsQuery);
    return skillRows;
}

async function getSkillsByUsingName(connection,skillName){
    const getSkillsQuery = `
        select skillId,name from Skills where name LIKE '%${skillName}%';
   `;
    const skillRows = await connection.query(getSkillsQuery);
    return skillRows;
}

  module.exports = {
    getJobCategories,
    getSkillsAll,
    getSkillsByUsingName,
  };
  