const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

const userProvider = require("./userProvider");
const jobDao=require('../JobCategories/jobDao');
const userDao = require("./userDao");
const resumeDao = require("../Resume/resumeDao");
const employmentDao=require("../Employment/employmentDao.js");
const companyDao=require("../Company/companyDao.js");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (name, phoneNumber, email, password, IsAcceptedPrivacyTerm, IsAcceptedMarketingTerm) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        //TODO 이메일체크 함수를 telCheck

        // 이메일 중복 

        const emailRows = await userProvider.emailCheck(email);


        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);



        //휴대전화 중복 확인

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");


        const insertUserInfoParams = [name, phoneNumber, email, hashedPassword, IsAcceptedPrivacyTerm, IsAcceptedMarketingTerm];

        
        console.log('test1');
        await connection.beginTransaction();

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        const userId=userIdResult[0].insertId;
        //console.log(`추가된 회원 : ${userId}`)
        const getJobGroupRows=await userDao.getJobGroupCategories(connection)
        console.log(getJobGroupRows);
        const result={};
        result.userId=userId;
        result.jobGroup=getJobGroupRows;

        await connection.commit() // 커밋

        
        return response(baseResponse.SUCCESS,result);


    } catch (err) {

        connection.rollback();
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();

    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports. postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        console.log("passwordCheck complete");
        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        console.log("password 맞음");
        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0]) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );
        console.log("jwt 발급 완료");
        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userId, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.postJobCatgory=async function(userId,jobGroupId,jobId,career,skills){   
    console.log(userId,jobGroupId,jobId,career,skills);
    if(jobGroupId!=1&&skills!=null)    return errResponse(baseResponse.NOT_DEVELOPMENT_CANT_HAVE_SKILL);
    
    // TODO : JobGroup 과 Job이 부모-자식 관계여야함. check 함수가 추가로 구현되어야함.
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        //,JobGroup,Job
        const getParam = await userDao.insertProfileInfo(connection,userId,career);
        console.log("hihi");
        console.log(getParam[0].insertId);
        const profileId=getParam[0].insertId;
        
        connection.beginTransaction();

        const insertJobCatgoryResult=await userDao.insertJobGroupCategoryInfo(connection,profileId,jobGroupId); 
        const insertJobIdResult=await userDao.insertJobCategoryInfo(connection,profileId,jobId)
        const updateUserStep=await userDao.updateUserState(connection,userId,"STEP2");
        console.log("확인");
        console.log(skills);
        
        for (let index = 0; index < skills.length; index++) {
            const insertUserSkill=await userDao.insertUserSkills(connection,userId,skills[index]);
        }
        
        connection.commit();
        

        return response(baseResponse.SUCCESS);
    }catch(err){
        connection.rollback();
        if(err=="insertProfileFail")  return errResponse({"isSuccess":false, "code":4001, "message":"fail insertProfile Query"});
        if(err=="insertJobGroupCategoryFail") return errResponse({"isSuccess":false, "code":4002, "message":"fail insertJobGroupCategory Query"});
        if(err=="insertJobCategoryFail") return errResponse({"isSuccess":false, "code":4003, "message":"fail insertJobCategory Query"});
        if(err=="updateUserStateFail") return errResponse({"isSuccess":false, "code":4004, "message":"fail updateUserStateFail Query"});
        if(err=="insertUserSkillResult") return errResponse({"isSuccess":false, "code":4005, "message":"fail insertUserSkillResult Query"});
        logger.error(`App - Post postJobCatgory Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

exports.postDefaultResume=async function(userId,userName,email,telephone,jobId,career,companyId,companyName,schoolName,skills){
    //companyId가 넘어올 수도 있음.
    console.log(userId,userName,email,telephone,jobId,career,companyId,companyName,schoolName,skills)
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        
        await connection.beginTransaction();

        // jobId로 jobName 뽑아내기
        const jobNametemp=await jobDao.getJobNameByJobId(connection,jobId);
        const jobName=jobNametemp.name;

        let self_introduction;
        if(career==0)
        {
            self_introduction="안녕하세요. 신입 "+jobName+"입니다.";    
        }else{
            self_introduction="안녕하세요. "+career+"년차"+jobName+"입니다.";
        }
        let resumeName=`${userName}`+"1";
        console.log(resumeName);
        console.log("Query1");
        const postResumeResult = await resumeDao.postResumeInfo(connection,resumeName,userId,userName,email,telephone,self_introduction);
        const resumeId=postResumeResult[0].insertId;
        console.log(resumeId);
        console.log("Query2");
        const insertProfileResumeId=await userDao.postResumeId(connection,userId,resumeId);
        const postResumeCareerResult=await resumeDao.postResumeCareerInfo(connection,resumeId,companyId,companyName);
        console.log("Query3");
        const postEducationResult=await resumeDao.postResumeEducationInfo(connection,resumeId,schoolName);
        console.log("Query4");
        for (let index = 0; index < skills.length; index++) {
            const postResumeSkillResult=await resumeDao.postResumeSkillInfo(connection,resumeId,skills[index]);    
        }

        const updateUserState=await userDao.updateUserState(connection,userId,"ACTIVE");

        await connection.commit() // 커밋

        

        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - Post Job and JobGroup Service error\n: ${err.message}`);
        await connection.rollback() // 롤백
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}


exports.postInterestedTags=async function(userId,postTagList){
    //companyId가 넘어올 수도 있음.
    
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
        for (let index = 0; index < postTagList.length; index++) {
            const postInterestedTagsResult=await userDao.postInterestedTags(connection,userId,postTagList[index]);
        }
        await connection.commit() // 커밋
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - Post Tag Service error\n: ${err.message}`);
        await connection.rollback() // 롤백
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}




exports.postBookMark=async function(userId,employmentId){
    //companyId가 넘어올 수도 있음.
    
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
       

        const postBookMarkResult=await userDao.postBookMark(connection,userId,employmentId);
        console.log("1번 함수 호출성공")
        let BookMarkCount=await employmentDao.getBookMarkCount(connection,employmentId);
        BookMarkCount=BookMarkCount+1;
        console.log("2번 함수 호출성공");
        console.log(BookMarkCount);
        const postBookMarkCountResult=await employmentDao.updateBookMarkCount(connection,employmentId,BookMarkCount);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - Post Tag Service error\n: ${err.message}`);
        await connection.rollback() // 롤백
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

exports.postHeart=async function(userId,employmentId){
    //companyId가 넘어올 수도 있음.
    
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
       

        const postHeartResult=await userDao.postHeart(connection,userId,employmentId);
        console.log("1번 함수 호출성공")
        let HeartCount=await employmentDao.getHeartCount(connection,employmentId);
        console.log("2번 함수 호출성공");
        console.log(HeartCount);
        HeartCount=HeartCount+1;
        const postHeartCountResult=await employmentDao.updateHeartCount(connection,employmentId,HeartCount);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - Post Heart Service error\n: ${err.message}`);
        await connection.rollback() // 롤백
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

exports.postFollow=async function(userId,companyId){
    //companyId가 넘어올 수도 있음.
    
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
       

        const postFollowResult=await userDao.postFollow(connection,userId,companyId);
        console.log("1번 함수 호출성공")
        const followCount=await companyDao.getFollowCount(connection,companyId);
        console.log("2번 함수 호출성공");
        console.log(followCount);
        const postFollowCountResult=await companyDao.updateFollowCount(connection,companyId,followCount);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - Post Heart Service error\n: ${err.message}`);
        await connection.rollback() // 롤백
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

exports.deleteBookMark=async function(userId,employmentId){
    //companyId가 넘어올 수도 있음.
    
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
       
        /*
            1. BookMarkTable 에서 status를 DELETED로 고칠것.
            2. Employments Table에서 BookMark Count를 하나 줄일 것. */


        const deleteBookMarkResult=await userDao.deleteBookMark(connection,userId,employmentId);
        console.log("1번 함수 호출성공")
        let BookMarkCount=await employmentDao.getBookMarkCount(connection,employmentId);
        BookMarkCount=BookMarkCount-1;
        // TODO BookMarkCount가 0이하일때 error response;
        console.log("2번 함수 호출성공");
        console.log(BookMarkCount);
        const plusBookMarkCount=await employmentDao.updateBookMarkCount(connection,employmentId,BookMarkCount);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - Delete BookMark Service error\n: ${err.message}`);
        await connection.rollback() // 롤백
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

exports.deleteHeart=async function(userId,employmentId){
    //companyId가 넘어올 수도 있음.
    
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
       
        /*
            1. BookMarkTable 에서 status를 DELETED로 고칠것.
            2. Employments Table에서 BookMark Count를 하나 줄일 것. */


        const deleteHeartResult=await userDao.deleteHeart(connection,userId,employmentId);
        console.log("1번 함수 호출성공")
        let HeartCount=await employmentDao.getHeartCount(connection,employmentId);
        HeartCount=HeartCount-1;
        console.log("2번 함수 호출성공");
        console.log(HeartCount);
        const deleteHeartCountResult=await employmentDao.updateHeartCount(connection,employmentId,HeartCount);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - Delete Heart Service error\n: ${err.message}`);
        await connection.rollback() // 롤백
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}


exports.deleteFollow=async function(userId,companyId){
    //companyId가 넘어올 수도 있음.
    
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
       

        const deleteFollowResult=await userDao.deleteFollow(connection,userId,companyId);
        console.log("1번 함수 호출성공")
        let followCount=await companyDao.getFollowCount(connection,companyId);
        followCount=followCount-1;
        console.log("2번 함수 호출성공");
        console.log(followCount);
        const updateFollowCountResult=await companyDao.updateFollowCount(connection,companyId,followCount);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - delete Follow Service error\n: ${err.message}`);
        await connection.rollback() // 롤백
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

exports.patchProfileImg=async function(userId,profileImg){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const postProfileImgResult=await userDao.patchProfileImg(connection,userId,profileImg);

        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - POST ProfileImg Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}


exports.updateProfileInfo=async function(userId,userName,userEmail,userPhoneNumber){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const updateProfileInfoResult=await userDao.updateProfileInfo(connection,userId,userName,userEmail,userPhoneNumber);

        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - UPDATE Profile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

exports.updateProfileSpecInfo=async function(params){
    /* userId,
      JobGroupId,                             -> profileJobGroupMapping
      JobId,                                  -> profileJobMapping
      career,salary,salaryPeriod,monetary     -> profile   
      skills,                                   -> userSkills
   */
    console.log(params);
    if(params.jobGroupId!=1&&params.skills!=null){
        return errResponse(baseResponse.NOT_DEVELOPMENT_CANT_HAVE_SKILL);
    }

    const connection = await pool.getConnection(async (conn) => conn);
    try{
        connection.beginTransaction();
        // UPDATE
        console.log("Query1");
        const updateProfile=await userDao.updateProfileData(connection,params);
        console.log("Query2");
        const updateJoGroup=await userDao.updateJobGroup(connection,params);
        console.log("Query3");
        const updateJob=await userDao.updateJob(connection,params);

        // 기존정보 삭제
        console.log("Query4");
        const deleteSkills=await userDao.deleteSkills(connection,params.userId);

        // 새로운 정보 삽입.
        console.log("QueryA");
        for (let index = 0; index < params.skills.length; index++) {
            const updateSkills=await userDao.newPostSkills(connection,params.userId,params.skills[index]);    
        }
        

        connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        connection.rollback();
        logger.error(`App - UPDATE Profile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

exports.postApplication=async function(resumeId,employmentId){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        console.log("Query1");
        const suggestApplicationResult=await userDao.suggestApplication(connection,resumeId,employmentId);

        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - SUGGEST Applicaton Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

exports.cancleApplication=async function(applicationId){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        console.log("Query1");
        const suggestApplicationResult=await userDao.cancleApplication(connection,applicationId);

        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - SUGGEST Applicaton Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}