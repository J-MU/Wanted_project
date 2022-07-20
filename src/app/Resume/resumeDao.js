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
//이력서 전체 조회
async function getResumes(connection, userId) {
    const getResumesQuery = `
    select resumeName, date_format(updatedAt,'%Y.%m.%d') as 'updatedAt' , status
    from Resumes
    where userId=?;
    `;
    const getResumesRows = await connection.query(getResumesQuery,userId);
    return getResumesRows[0];
}
//이력서 삭제
async function deleteResumes(connection, deleteResumesParams) {
    const deleteResumesQuery = `
    UPDATE WANTED.Resumes t SET t.status = 'DELETED'
    WHERE t.userId=? and t.resumeId =?;
    `;
    console.log(deleteResumesQuery);
    const deleteResumesRows = await connection.query(deleteResumesQuery,deleteResumesParams);
    return deleteResumesRows
}

//이력서 생성
async function postResumes(connection, userId){
    const postResumesQuery= `
        INSERT INTO WANTED.Resumes (userId, resumeName, userName, userEmail, userTel)
        select Users.userId,
               concat(name,
                      (select count(userId+1) FROM Resumes
                       where (status = '작성 중' or status = '작성 완료') and userId = ?)
                   ) as resumeName,name, email, phoneNumber
        from Users
        limit 1;
    `;
    const postResumesRows = await connection.query(postResumesQuery, userId);
    return postResumesRows
}

  module.exports = {
    postResumeInfo,
    postResumeCareerInfo,
    postResumeEducationInfo,
    postResumeSkillInfo,
      getResumes,
      deleteResumes,
      postResumes
  };
  