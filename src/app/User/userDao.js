const { USER_NAME_EMPTY } = require("../../../config/baseResponseStatus");

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
  console.log(email);
  const selectUserEmailQuery = `
                SELECT email
                FROM Users
                WHERE email = "${email}";
                `;
  const emailRows = await connection.query(selectUserEmailQuery);
  return emailRows[0];
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

async function getUserNameUsingUserId(connection,userId){

  const selectUserNameQuery=`
    SELECT name
    FROM Users
    WHERE userId=${userId}
  `;

  const userName=await connection.query(selectUserNameQuery);
  return userName[0][0].name;
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

// JobCategory설정 funtion1
async function insertJobGroupCategoryInfo(connection,profileId,categoryId) {
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

async function insertJobCategoryInfo(connection,profileId,categoryId) {
  console.log('insertJobCategoryInfo 함수 호출 완료.');
  const insertJobCategoryInfoQuery = `
        INSERT INTO profileJobMapping(profileId,categoryId)
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

async function getProfileIdAndCareerUsingUserId(connection,userId){
  const getProfileIdUsingUserIdQuery=`
      SELECT profileId,career FROM Users
      LEFT JOIN Profiles ON Users.userId=Profiles.userId
      WHERE Users.userId=${userId};
  `;

  const profileId=await connection.query(getProfileIdUsingUserIdQuery);

  return profileId[0]
}



// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, password
        FROM Users 
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
        SELECT status, userId
        FROM Users 
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

async function postBookMark(connection,userId,employmentId){
  
  const postBookMarkQuery=`
    INSERT INTO BookMark(userId, employmentId)
    VALUES  (${userId},${employmentId});
  `

  console.log(postBookMarkQuery);
  const postBookMarkResult=await connection.query(postBookMarkQuery);
  return postBookMarkResult;
}

async function postHeart(connection,userId,employmentId){
  
  const postHeartQuery=`
    INSERT INTO Heart(userId, employmentId)
    VALUES  (${userId},${employmentId});
  `

  console.log(postHeartQuery);
  const postHeartResult=await connection.query(postHeartQuery);
  return postHeartResult;
}

async function postFollow(connection,userId,companyId){
  
  const postFollowQuery=`
    INSERT INTO Follow(userId, companyId)
    VALUES  (${userId},${companyId});
  `

  console.log(postFollowQuery);
  const postFollowResult=await connection.query(postFollowQuery);
  return postFollowResult;
}

async function deleteBookMark(connection,userId,employmentId){
  
  const deleteBookMarkQuery=`
    UPDATE BookMark
    SET status='DELETED'
    WHERE userId=${userId} and employmentId=${employmentId};
  `

  console.log(deleteBookMarkQuery);
  const deleteBookMarkResult=await connection.query(deleteBookMarkQuery);
  return deleteBookMarkResult;
}


async function deleteHeart(connection,userId,employmentId){
  
  const deleteHeartQuery=`
    UPDATE Heart
    SET status='DELETED'
    WHERE userId=${userId} and employmentId=${employmentId};
  `

  console.log(deleteHeartQuery);
  const deleteHeartQueryResult=await connection.query(deleteHeartQuery);
  return deleteHeartQueryResult;
}

async function deleteFollow(connection,userId,companyId){
  
  const deleteFollowQuery=`
    UPDATE Follow
    SET status='DELETED'
    WHERE  userId=${userId} and companyId=${companyId};
  `

  console.log(deleteFollowQuery);
  const deleteFollowResult=await connection.query(deleteFollowQuery);
  return deleteFollowResult;
}

async function updateUserState(connection,userId,stepLevel){

  const updateUserStateQuery=`
    UPDATE Users
    SET status="${stepLevel}"
    WHERE  userId=${userId};
  `

  console.log(updateUserStateQuery);
  const updateResult=await connection.query(updateUserStateQuery);



  return updateResult;
}


async function getUserStatus(connection,userId,stepLevel){

  const getUserStatusQuery=`
    SELECT status 
    FROM Users
    WHERE userId=${userId};
  `

  console.log(getUserStatusQuery);
  const userStatus=await connection.query(getUserStatusQuery);



  return userStatus[0];
}

async function getDefaultResumeInfo(connection,userId){

  const getDefaultResumeInfoQuery=`
    
  `

  console.log(getDefaultResumeInfoQuery);
  const temp=await connection.query(getDefaultResumeInfoQuery);



  return temp[0];
}

async function postResumeId(connection,userId,resumeId){

  const postResumeIdQuery=`
      UPDATE Profiles
      SET resumeId=${resumeId}
      WHERE userId=${userId}
  `;

  console.log(postResumeIdQuery);
  const insertResumeInfo=await connection.query(postResumeIdQuery);



  return insertResumeInfo[0];
}


module.exports = {
  selectUser,
  insertJobGroupCategoryInfo,
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
  postBookMark,
  postHeart,
  postFollow,
  deleteBookMark,
  deleteHeart,
  deleteFollow,
  updateUserState,
  getUserStatus,
  getProfileIdAndCareerUsingUserId,
  getUserNameUsingUserId,
  postResumeId,
};
