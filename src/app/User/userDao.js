// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}


// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email
                FROM Users
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, nickname 
                 FROM UserInfo 
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  console.log('insertUserInfo');
  const insertUserInfoQuery = `
        INSERT INTO Users(name, phoneNumber, email, password, IsAcceptedPrivacyTerm, IsAcceptedMarketingTerm)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// JobCategory설정 funtion
async function insertJobCategoryInfo(connection,profileId,categoryId) {
  console.log('insertJobCategoryInfo 함수 호출 완료.');
  const insertJobCategoryInfoQuery = `
        INSERT INTO profileJobGroupMapping(profileId,categoryId)
        VALUES (${profileId},${categoryId});
    `;
  const insertJobCategoryInfoRow = await connection.query(
    insertJobCategoryInfoQuery,
    profileId,
    categoryId
  );

  return insertJobCategoryInfoRow;
}

async function insertUserSkills(connection,userId,skillId) {
  console.log('insertUserSkills 함수 호출 완료.');
  const insertUserSkillsQuery = `
        INSERT INTO userSkills(userId,skillId)
        VALUES (${userId},${skillId});
    `;
  const insertUserSkillResult = await connection.query(
    insertUserSkillsQuery,
    userId,
    skillId
  );

  return insertUserSkillResult;
}

async function insertProfileInfo(connection,userId,career) {
    const insertProfileInfoQuery = `
      INSERT INTO Profiles(userId,career)
      VALUES (${userId},${career});
    `;

    const insertProfileInfoResult = await connection.query(
      insertProfileInfoQuery,
      userId,
      career
    );

    return insertProfileInfoResult;
}



// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM UserInfo 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}

async function getJobGroupCategories(connection){
  const getJobGroupCategoriesQuery=`
   select jobGroupCategoryId,name from WANTED.JobGroupCategories;
  `

  const jobcategoriesRow=await connection.query(getJobGroupCategoriesQuery);
  return jobcategoriesRow[0];
}

async function postInterestedTags(connection,userId,postTagId){
  const postInterestedTagsQuery=`
    INSERT INTO UserPostTagMapping(userId, postTagId)
    VALUES  (${userId},${postTagId});
  `
  console.log(postInterestedTagsQuery);
  const postInterestedTagsResult=await connection.query(postInterestedTagsQuery);
  return postInterestedTagsResult;
}
/*
//학교 직장 설정
async function
*/



module.exports = {
  selectUser,
  insertJobCategoryInfo,
  insertUserSkills,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  getJobGroupCategories,
  insertProfileInfo,
  postInterestedTags,
};
