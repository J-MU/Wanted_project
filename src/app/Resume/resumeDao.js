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
    select resumeId, resumeName, date_format(updatedAt,'%Y.%m.%d') as 'updatedAt' , status
    from Resumes
    where userId=? and status!='DELETED';
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
                       where (status = '작성 중' or status = '작성 완료') and userId = ${userId})
                   ) as resumeName,name, email, phoneNumber
        from Users
        where userId=${userId}
       
        limit 1;
    `;
    const postResumesRows = await connection.query(postResumesQuery, userId);

    const resumeIdQuery= `
    select resumeId
    from Resumes as R
    where userId=?;
    `

    const resumeIdQueryRows = await connection.query(resumeIdQuery, userId);

    return resumeIdQueryRows[0]
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
        select companyName ,type , 
               case when DepartmentAndTitle='undefined' then DepartmentAndTitle=null
               else DepartmentAndTitle
               end as DepartmentAndTitle,
               case when startDate='undefined' then startDate=null
                   else startDate
                   end as startDate, 
                case when endDate='undefined' then endDate=null
                    else startDate
        end as endDate
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
        select date_format(period , '%Y.%m') as period, name, details
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

//이력서 경력 수정
async function patchResumeCareer(connection, params) {
    const patchResumeCareerQuery = `
        UPDATE Careers  SET companyName='${params[1]}', type='${params[2]}', DepartmentAndTitle='${params[3]}', startDate='${params[4]}', endDate='${params[5]}'
        WHERE careerId=${params[0]};
    `;

    const  postEducationSchoolRows = await connection.query(patchResumeCareerQuery, params);

    return  postEducationSchoolRows[0]
}

//이력서 학력 수정
async function patchResumeEducation(connection,params) {
    const patchResumeEducationQuery = `
        UPDATE Education  SET name='${params[1]}', MajorOrDegree='${params[2]}', subject='${params[3]}', startDate='${params[4]}', endDate='${params[5]}'
        WHERE educationId=${params[0]};
    `;

    const  patchResumeEducationRows = await connection.query(patchResumeEducationQuery, params);

    return  patchResumeEducationRows[0]
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
        select name , uS.skillId
        from Skills
                 inner join userSkills as uS on uS.skillId=Skills.skillId
        where userId=?;
    `;

    const  getResumeUserSkillsRows = await connection.query(getResumeUserSkillsQuery, userId);
    return  getResumeUserSkillsRows[0]

}
//수상 추가하기

async function postResumeAwards (connection, postResumeAwardsParams) {
    const  postResumeAwardsQuery = `
        insert into awards (resumeId, period, name, details)
        values(${postResumeAwardsParams[0]}, nullif('${postResumeAwardsParams[1]}','') ,
               '${postResumeAwardsParams[2]}',nullif('${postResumeAwardsParams[3]}',''));
    `;

    const  postResumeAwardsRows = await connection.query(postResumeAwardsQuery, postResumeAwardsParams);
    return  postResumeAwardsRows[0]

}

//수상 수정하기
async function patchResumeAwards(connection,params) {
    const patchResumeAwardsQuery = `
        UPDATE awards  SET period='${params[1]}', name='${params[2]}', details='${params[3]}'
        WHERE awardsId=${params[0]};
    `;

    const  patchResumeAwardsRows = await connection.query(patchResumeAwardsQuery, params);

    return  patchResumeAwardsRows[0]
}

//수상 삭제하기

async function deleteResumeAwards (connection, awardsId) {
    const  deleteResumeAwardsQuery = `
    UPDATE awards t SET t.status = 'DELETED'
    WHERE awardsId=?;
    `;
    const deleteResumeAwardsRows = await connection.query(deleteResumeAwardsQuery,awardsId);
    return  deleteResumeAwardsRows
}
//이력서 간단 소개글 글자수 세기
async function selfIntroductionCheck (connection, resumeId) {
    const  selfIntroductionCheckQuery = `
        select char_length(selfIntroduction) as 'selfIntroductionNum'
        from Resumes
        where resumeId=?;
    `;
    const selfIntroductionCheckRows = await connection.query(selfIntroductionCheckQuery,resumeId);
    const num = selfIntroductionCheckRows[0][0].selfIntroductionNum

    return  num;
}

//이력서 경력 체크
async function careerCheck (connection, resumeId) {
    const  careerCheckQuery = `
        select companyName, startDate,endDate
        from Careers
        where resumeId=?;
    `;
    const careerCheckRows = await connection.query(careerCheckQuery,resumeId);;
    return   careerCheckRows[0];
}

//전공 체크
async function majorCheck (connection, resumeId) {
    const  majorCheckQuery = `
        select name, MajorOrDegree
        from Education
        where resumeId=?
    `;
    const  majorCheckRows = await connection.query(majorCheckQuery,resumeId);;
    return   majorCheckRows[0];
}

//수상 있는지 체크
async function awardsCheck(connection, resumeId) {
    const awardsCheckQuery = `
        select name, details
        from awards
        where resumeId=?
    `;
    const  awardsCheckRows = await connection.query(awardsCheckQuery,resumeId);;
    return   awardsCheckRows[0];
}

//작성 완료로 바꿈
async function postResumeStatus(connection, resumeId) {
    const  postResumeStatusQuery = `
    UPDATE Resumes t SET t.status = '작성 완료'
    WHERE resumeId=?;
    `;
    const postResumeStatusRows = await connection.query(postResumeStatusQuery,resumeId);
    return  postResumeStatusRows
}

//작성 중으로 바꿈
async function postResumeStatusIng (connection, resumeId){
    const  postResumeStatusIngQuery = `
    UPDATE Resumes t SET t.status = '작성 중'
    WHERE resumeId=?;
    `;
    const postResumeStatusIngRows = await connection.query(postResumeStatusIngQuery,resumeId);
    return  postResumeStatusIngRows
}

//유저 스킬 추가하기
async function  postResumeUserSkills(connection,  params ) {
    const  postUserResumeSkillsQuery = `
        insert into ResumeSkillsMapping(resumeId, skillId)
        values(${params[0]},${params[1]});
    `;
    const postUserResumeRows = await connection.query( postUserResumeSkillsQuery, params );
    return  postUserResumeRows
}


//스킬 추가

async function postResumeSkills(connection, postResumeSkillsParams){
    console.log(postResumeSkillsParams);
    const  postResumeSkillsQuery = `
        insert into ResumeSkillsMapping(resumeId, skillId)
        values(${postResumeSkillsParams[0]},${postResumeSkillsParams[1]});
    `;
    const postResumeSkillsRows = await connection.query(postResumeSkillsQuery, postResumeSkillsParams );
    return  postResumeSkillsRows
}

//스킬 삭제
async function deleteResumeSkills(connection,deleteResumeSkillsParams ) {
    console.log(deleteResumeSkillsParams[0])

    const  deleteResumeSkillsQuery = `
    UPDATE ResumeSkillsMapping 
    SET status = 'DELETED'
    WHERE resumeId=${deleteResumeSkillsParams[0]} and skillId=${deleteResumeSkillsParams[0]};
    `;

    const deleteResumeSkillsRows = await connection.query(deleteResumeSkillsQuery,deleteResumeSkillsParams);

    return  deleteResumeSkillsRows
}


//이력서 userInfo 수정
async function patchResumeUserInfo (connection, params) {
    const patchResumeUserInfoQuery = `
        UPDATE Resumes  SET resumeName='${params[1]}', userName='${params[2]}', userEmail='${params[3]}' ,userTel='${params[4]}',selfIntroduction='${params[5]}'
        WHERE resumeId=${params[0]};
    `;

    const  patchResumeUserInfoRows = await connection.query(patchResumeUserInfoQuery, params);

    return  patchResumeUserInfoRows[0]
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
    getResumeUserSkills,
    postResumeAwards,
    deleteResumeAwards,
    selfIntroductionCheck,
     careerCheck,
     majorCheck,
     awardsCheck,
     postResumeStatus,
     postResumeUserSkills,
    postResumeSkills,
     deleteResumeSkills,
     postResumeStatusIng,
     patchResumeCareer,
     patchResumeEducation,
     patchResumeAwards,
     patchResumeUserInfo
};
