// 모든 유저 조회
async function getJobCategories(connection,jobGroupId) {
    let jobCategoryRows;

    const getJobCategoriesQuery = `
             select categoryId,name 
             from JobCategories 
             where jobGroupCategoryId=${jobGroupId};
                  `;
    try{
      jobCategoryRows = await connection.query(getJobCategoriesQuery);
    }catch(err){
      throw "getJobCategoriesFail";
    }
    
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

async function checkJobGroupIdValidable(connection,jobGroupId) {
  let jobCategoryRows;
  const getJobCategoriesQuery = `
           select jobGroupCategoryId,name
           from JobGroupCategories 
           WHERE jobGroupCategoryId=${jobGroupId};
                `;
  try{
      jobCategoryRows = await connection.query(getJobCategoriesQuery);
  }catch(err){
    throw "getJobCategoriesFail";
  }
  return jobCategoryRows;
}

async function getJobNameByJobId(connection,jobId) {
  let jobCategoryRows;
  const getJobCategoriesQuery = `
          select name 
          FROM JobCategories
           where categoryId=${jobId};
                `;
  try{
    jobCategoryRows = await connection.query(getJobCategoriesQuery);
  }catch(err){
    throw "getJobNameFail";
  }
    
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

async function getJobNameUsingProfileId(connection,profileId){
  const getJobNameUsingProfileIdQuery=`
      SELECT JC.name FROM Profiles
      LEFT JOIN profileJobMapping ON Profiles.profileId=profileJobMapping.profileId
      LEFT JOIN JobCategories JC on profileJobMapping.categoryId = JC.categoryId
      WHERE Profiles.profileId=${profileId};
  `;

  const jobName=await connection.query(getJobNameUsingProfileIdQuery);
  return jobName[0];
}

  module.exports = {
    getJobCategories,
    getJobGroupCategories,
    getJobNameByJobId,
    getJobGroupCategoryId,
    getJobNameUsingProfileId,
    checkJobGroupIdValidable,
  };
  