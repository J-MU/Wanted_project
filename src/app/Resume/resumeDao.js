// 모든 유저 조회
async function postResumeInfo(connection,resumeName,userId,userName,email,telephone,self_introduction) {
    const postResumeInfoQuery = `
        INSERT INTO Resumes(userId, resumeName, userName, userEmail, userTel, selfIntroduction)
        VALUES (${userId},"${resumeName}","${userName}","${email}","${telephone}","${self_introduction}");
                  `;
        console.log(postResumeInfoQuery);

    const postResumeInfoResult = await connection.query(postResumeInfoQuery);
    return postResumeInfoResult;
}

async function postResumeCareerInfo(connection,resumeId,companyId,companyName) {
    const postResumeCareerInfoQuery = `
            INSERT INTO Careers(resumeId,companyId,companyName)
            VALUES (${resumeId},${companyId},"${companyName}");
                  `;
        console.log(postResumeCareerInfoQuery);
    const postResumeCareerInfoResult = await connection.query(postResumeCareerInfoQuery);
    return postResumeCareerInfoResult;
}

async function postResumeEducationInfo(connection,resumeId,schoolName) {
    const postResumeEducationInfoQuery= `
            INSERT INTO Education(resumeId, name)
            VALUES (${resumeId},"${schoolName}");
                  `;
    console.log(postResumeEducationInfoQuery);
    const postResumeEducationInfoResult = await connection.query(postResumeEducationInfoQuery);
    return postResumeEducationInfoResult;
}

async function postResumeSkillInfo(connection,resumeId,skillId) {
    const getJobCategoriesQuery = `
        INSERT INTO ResumeSkillsMapping(resumeId,skillId)
        VALUES (${resumeId},${skillId});
                  `;

    console.log(getJobCategoriesQuery);
    const jobCategoryRows = await connection.query(getJobCategoriesQuery);
    return jobCategoryRows;
}
  module.exports = {
    postResumeInfo,
    postResumeCareerInfo,
    postResumeEducationInfo,
    postResumeSkillInfo,
  };
  