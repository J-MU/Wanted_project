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
            INSERT INTO Careers(resumeId,companyName)
            VALUES (${resumeId},"${companyName}");
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

//이력서 개인정보 및 간단 소개글 가져오기
async function getResumeInfo(connection, getResumeParams){

    const getResumeQuery = `
    select resumeName, userName, userEmail, replace(userTel,'010','+8210') as userTel, selfIntroduction
    from Resumes
    where resumeId=${getResumeParams[1]} and userId=${getResumeParams[0]};
    `;

    const getResumeRows = await connection.query(getResumeQuery, getResumeParams);
    return getResumeRows[0]

}

//경력 가져오기
async function getResumeCareer(connection, getResumeParams) {
    const getResumeCareerQuery = `
        select companyName,DepartmentAndTitle,type, date_format(startDate, '%Y.%m') as startDate, date_format(endDate, '%Y.%m') as endDate
        from Careers
        where resumeId=${getResumeParams[1]} and status!='DELETED';
    `;

    const getResumeCareerRows = await connection.query(getResumeCareerQuery,getResumeParams);
    return getResumeCareerRows[0]
}


//학력 가져오기

async function getResumeEducation(connection, getResumeParams) {
    const getResumeEducationQuery = `
        select name, MajorOrDegree,subject, date_format(startDate, '%Y.%m') as startDate, date_format(endDate, '%Y.%m') as endDate
        from Education
                 inner join Resumes as r on r.resumeId = Education.resumeId
        where r.resumeId=${getResumeParams[1]} and Education.status!='DELETED';
    `;

    const getResumeEducationRows = await connection.query(getResumeEducationQuery,getResumeParams);
    return getResumeEducationRows[0]
}
//스킬 가져오기

async function getResumeSkills(connection, getResumeParams) {
    const getResumeSkillsQuery = `
        select S.name
        from Skills as S
                 inner join ResumeSkillsMapping as RS on RS.skillId=S.skillId
        where resumeId=${getResumeParams[1]} and S.status!='DELETED';
    `;

    const getResumeSkillsRows = await connection.query(getResumeSkillsQuery, getResumeParams);
    return getResumeSkillsRows[0]
}

//수상 및 기타

async function getResumeAwards(connection, getResumeParams) {
    const getResumeAwardsQuery = `
        select date_format(period , '%Y.%m'), name, details
        from awards
        where resumeId=${getResumeParams[1]} and status!='DELETED';
    `;

    const getResumeAwardsRows = await connection.query(getResumeAwardsQuery, getResumeParams);
    return getResumeAwardsRows[0]
}

//외국어

async function getResumeForeign (connection, getResumeParams) {
    const getResumeForeignQuery = `
        select foreignLanguage, level
        from foreignLanguages
        where resumeId=${getResumeParams[1]} and status!='DELETED';
    `;

    const getResumeForeignRows = await connection.query(getResumeForeignQuery, getResumeParams);
    return getResumeForeignRows[0]
}

//링크
async function getResumeLink (connection, getResumeParams) {
    const  getResumeLinkQuery = `
        select linkAddress
        from links
        where resumeId=${getResumeParams[1]} and status!='DELETED';
    `;

    const getResumeLinkRows = await connection.query(getResumeLinkQuery, getResumeParams);
    return getResumeLinkRows[0]
}
//이력서 이름 조회하기
async function getResumeTitle (connection, getResumeParams) {
    const  getResumeTitleQuery = `
        select resumeName
        from Resumes
        where resumeId=${getResumeParams[1]};
    `;

    const  getResumeTitleRows = await connection.query(getResumeTitleQuery, getResumeParams);
    return  getResumeTitleRows[0]
}


//이력서 이름 변경
async function patchResumeTitle (connection, getResumeParams) {
    const  patchResumeTitleQuery = `
        update Resumes
        set resumeName = '${getResumeParams[2]}'
        WHERE resumeId = ${getResumeParams[1]} and userId=${getResumeParams[0]};
    `;

    const  patchResumeTitleRows = await connection.query(patchResumeTitleQuery, getResumeParams);

    return  patchResumeTitleRows[0]
}

//이력서 경력 생성
async function postResumeCareer(connection, postResumeCareerParams) {
    console.log(postResumeCareerParams);
    const postResumeCareerQuery = `
        insert into Careers (resumeId, companyName, type)
        values(${postResumeCareerParams[0]},'${postResumeCareerParams[1]}','${postResumeCareerParams[2]}');
    `;

    const  postResumeCareerRows = await connection.query(postResumeCareerQuery,postResumeCareerParams);

    return  postResumeCareerRows[0]
}

//이력서 경력 삭제
async function deleteResumeCareer(connection, careerId) {
    const deleteResumeCareerQuery = `
    UPDATE Careers t SET t.status = 'DELETED'
    WHERE careerId=?;
    `;
    const deleteResumeCareerRows = await connection.query(deleteResumeCareerQuery,careerId);
    return deleteResumeCareerRows
}

//이력서 학교 검색

async function getEducationSchool  (connection, schoolName) {
    console.log(schoolName);
    const   getEducationSchoolQuery = `
        select name
        from school
        where name LIKE '%${schoolName}%';
    `;

    const  getEducationSchoolRows = await connection.query(getEducationSchoolQuery, schoolName);

    return   getEducationSchoolRows[0]
}

//이력서 학교 추가
async function postEducationSchool(connection, postEducationSchoolParams) {
    const postEducationSchoolQuery = `
        insert into Education (resumeId, name)
        values(${postEducationSchoolParams[0]},'${postEducationSchoolParams[1]}');
    `;

    const  postEducationSchoolRows = await connection.query(postEducationSchoolQuery,postEducationSchoolParams);

    return  postEducationSchoolRows[0]
}

//이력서 학교 삭제

async function  deleteResumeEducation(connection, educationId) {
    const  deleteResumeEducationQuery = `
    UPDATE Education t SET t.status = 'DELETED'
    WHERE educationId=?;
    `;
    const  deleteResumeEducationRows = await connection.query( deleteResumeEducationQuery,educationId);
    return  deleteResumeEducationRows
}

//인기있는 스킬 조회

async function getPopularSkills (connection) {
    const  getPopularSkillsQuery = `
        select name
        from Skills
        limit 10;
    `;

    const  getPopularSkillsRows = await connection.query(getPopularSkillsQuery);
    return  getPopularSkillsRows[0]
}

//유저 스킬 가져오기

async function getResumeUserSkills (connection, userId) {
    const  getResumeUserSkillsQuery = `
        select name
        from Skills
                 inner join userSkills as uS on uS.skillId=Skills.skillId
        where userId=?;
    `;

    const  getResumeUserSkillsRows = await connection.query(getResumeUserSkillsQuery, userId);
    return  getResumeUserSkillsRows[0]

}

 module.exports = {
    postResumeInfo,
    postResumeCareerInfo,
    postResumeEducationInfo,
    postResumeSkillInfo,
     getResumes,
     deleteResumes,
     postResumes,
     getResumeInfo,
     getResumeCareer,
     getResumeEducation,
     getResumeSkills,
     getResumeAwards,
    getResumeForeign,
     getResumeLink,
     getResumeTitle,
     patchResumeTitle,
     postResumeCareer,
     deleteResumeCareer,
     getEducationSchool,
     postEducationSchool,
     deleteResumeEducation,
    getPopularSkills,
    getResumeUserSkills
};
  