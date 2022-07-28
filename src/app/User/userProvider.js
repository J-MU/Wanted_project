const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const userDao = require("./userDao");
const jobProvider=require("../JobCategories/jobProvider");
const schoolProvider=require("../School/schoolProvider");
const resumeProvider=require("../Resume/resumeProvider");
const companyProvider=require("../Company/companyProvider");
const { profile } = require("winston");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
};

exports.emailCheck = async function (email) {
  let emailCheckResult;
  const connection = await pool.getConnection(async (conn) => conn);
  try{
    emailCheckResult = await userDao.selectUserEmail(connection, email);
  }catch(err){
    throw "emailCheckFail";
  }
  
  console.log(emailCheckResult);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  let passwordCheckResult;

  const connection = await pool.getConnection(async (conn) => conn);
  try{
      passwordCheckResult = await userDao.selectUserPassword(
        connection,
        selectUserPasswordParams
    );
  }catch(err){
    throw "passwordCheckFail";
  }
  
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  let userAccountResult;
  const connection = await pool.getConnection(async (conn) => conn);
  try{
    userAccountResult = await userDao.selectUserAccount(connection, email);
  }catch(err){
    throw "accountCheckFail";
  }
  
  connection.release();

  return userAccountResult;
};


exports.getUserStatus = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);

  try{
    console.log("getUserStatus Service Run");
    const userStatus = await userDao.getUserStatus(connection, userId);
    
    return userStatus[0].status;
  }catch(err){
        logger.error(`App - GET User Status Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
  }finally{
    connection.release();
  }
  
};


exports.getProfileDataSTEP2 = async function (userId,userStatus) {
  /*
    기본이력서에 필요한 학교, 회사를 등록하게 되는 페이지를 띄워주는데 필요한 function이다.
    23,28번 API를 사용해 학교 목록과 회사 목록을 띄워준다.
    기본이력서에 저장되어야하는 자기소개글(자동생성)을 만들어 띄워준다.
  */
  const connection = await pool.getConnection(async (conn) => conn);
  console.log("getProfileData STEP2 Service Run");
  
    
  
  try{
    //const shcoolList=resumeProvider.getEducationSchool();// ? 그냥 학교 목록 불러주는거 아님?
    // 1. userId를 통해 profileId를 불러온다.
    // 2. profileId를 통해 jobName을 불러온다.
    // 3. profileId를 통해 career를 불러온다.
    // 4. 2번과 3번에서 불러온 jobName과 career를 통해 default self_introduction을 생성한다.
    const userName=await userDao.getUserNameUsingUserId(connection,userId);
    console.log(userName);
    const profileObject=await userDao.getProfileInfoUsingUserId(connection,userId);
    const profileId=profileObject[0].profileId;
    const career=profileObject[0].career;
    
    console.log("ProfileObject:",profileObject);
    console.log("profileId: ",profileId);
    console.log("career: ",career);
    const jobName=await jobProvider.getJobNameUsingProfileId(profileId);
    const totalData={};

    console.log("jobName: ",jobName);

    let self_introduction;
    if(career==0)
    {
        self_introduction="안녕하세요. 신입 "+jobName+"입니다.";    
    }else{
        self_introduction="안녕하세요. "+career+"년차 "+jobName+"입니다.";
    }
    let resumeName=`${userName}`+" 1";

    console.log("self_introduction: ",self_introduction);
    console.log("resumeName: ",resumeName);

    const companyList=await companyProvider.getCompanies();
    const schoolList=await schoolProvider.getSchools();

    console.log("Is CompanyList 잘 받아와짐?");
    console.log(companyList);
    console.log(schoolList);
    
    totalData.self_introduction=self_introduction;
    totalData.companyList=companyList;
    totalData.schoolList=schoolList;
    
    return totalData;
  }catch(err){getJobName
        if(err=="selectUserNameFail") return errResponse({"isSuccess":false,"code":4001,"message":"fail selectUserName Query"});
        if(err=="getProfileInfoFail") return errResponse({"isSuccess":false,"code":4002,"message":"fail getProfileInfo Query"});
        if(err=="getJobNameFail") return errResponse({"isSuccess":false,"code":4003,"message":"fail getJobName Query"});
        if(err=="getCompaniesFail") return errResponse({"isSuccess":false,"code":4004,"message":"fail getCompanies Query"});
        if(err=="getSchoolsFail") return errResponse({"isSuccess":false,"code":4005,"message":"fail getSchools Query"});
        logger.error(`App - GET ProfileData STEP2 Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
  }finally{
    connection.release();
  }
  
};

exports.getProfileInfoUsingUserId=async function(userId){
  const connection = await pool.getConnection(async (conn) => conn);
  console.log("getProfileId Service Run");
  try{
    const profileId=await userDao.getProfileInfoUsingUserId(connection,userId);
    console.log(profileId);
    return profileId[0];
  }catch(err){
    if(err=="getProfileInfoFail") throw "getProfileInfoFail";
    logger.error(`App - GET ProfileData ACTIVE Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }finally{
    connection.release();
  }
}

exports.getProfileDataACTIVE = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  console.log("getProfileData ACTIVE Service Run");
  
  try{
    const resumeInfo = await userDao.getDefaultResumeInfo(connection, userId);
    console.log("resumeInfo");
    console.log(resumeInfo);

    const jobName=resumeInfo.jobName;
    const career=resumeInfo.career;
    let self_introduction;
        if(career==0)
        {
            self_introduction="안녕하세요. 신입 "+ jobName+"입니다.";
        }else{
            self_introduction="안녕하세요. "+career+"년차 "+jobName+"입니다.";
        }
    resumeInfo.self_introduction=self_introduction

    delete resumeInfo.jobName;
    delete resumeInfo.career;
    console.log("resumeInfo: ");
    console.log(resumeInfo);
    return resumeInfo;
  }catch(err){
        logger.error(`App - GET ProfileData ACTIVE Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
  }finally{
    connection.release();
  }
  
};

exports.getUserInfo = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  console.log("getProfileData ACTIVE Service Run");
  
  try{
    const userInfo = await userDao.getUserInfo(connection, userId);
    
    return userInfo;
  }catch(err){
        logger.error(`App - GET ProfileData ACTIVE Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
  }finally{
    connection.release();
  }
  
};