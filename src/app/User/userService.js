const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

const userProvider = require("./userProvider");
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
    try {
        //TODO 이메일체크 함수를 telCheck

        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");


        const insertUserInfoParams = [name, phoneNumber, email, hashedPassword, IsAcceptedPrivacyTerm, IsAcceptedMarketingTerm];

        // TODO transaction 적용해야함.
        const connection = await pool.getConnection(async (conn) => conn);
        console.log('test1');

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        const userId=userIdResult[0].insertId;
        //console.log(`추가된 회원 : ${userId}`)
        const getJobGroupRows=await userDao.getJobGroupCategories(connection)
        console.log(getJobGroupRows);
        const result={};
        result.userId=userId;
        result.jobGroup=getJobGroupRows;
        connection.release();
        return response(baseResponse.SUCCESS,result);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
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

exports.postJobCatgory=async function(userId,jobGroupId,jobId,career,skills){   //TODO JobGroup,Job이 name이 아니라 id여야 함.
    console.log(userId,jobGroupId,jobId,career,skills);
    if(jobGroupId!=1&&skills!=null){
        return errResponse(baseResponse.NOT_DEVELOPMENT_CANT_HAVE_SKILL);
    }
    // TODO : JobGroup 과 Job이 부모-자식 관계여야함. check 함수가 추가로 구현되어야함.
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        //,JobGroup,Job
        const getParam = await userDao.insertProfileInfo(connection,userId,career);// TODO profileId 받아와야함.
        console.log("hihi");
        console.log(getParam[0].insertId);
        const profileId=getParam[0].insertId;
        const insertJobCatgoryResult=await userDao.insertJobCategoryInfo(connection,profileId,jobGroupId); //
        const insertJobIdResult=await userDao.insertJobCategoryInfo(connection,profileId,jobGroupId)
        console.log("확인");
        console.log(skills);
        
        for (let index = 0; index < skills.length; index++) {
            const insertUserSkill=await userDao.insertUserSkills(connection,userId,skills[index]);
        }
        
        connection.release();

        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - Post Job and JobGroup Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.postDefaultResume=async function(userId,userName,email,telephone,jobName,career,companyId,companyName,schoolName,skills){
    //companyId가 넘어올 수도 있음.
    console.log(userId,userName,email,telephone,jobName,career,companyId,companyName,schoolName,skills)
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        
        await connection.beginTransaction();

        let self_introduction;
        if(career==0)
        {
            self_introduction="안녕하세요. 신입 "+jobName+"입니다.";    
        }else{
            self_introduction="안녕하세요. "+career+"년차"+jobName+"입니다.";
        }
        let resumeName=`${userName}`+"1";
        console.log("Query1");
        const postResumeResult = await resumeDao.postResumeInfo(connection,resumeName,userId,userName,email,telephone,self_introduction);
        const resumeId=postResumeResult[0].insertId;
        console.log(resumeId);
        console.log("Query2");
        const postResumeCareerResult=await resumeDao.postResumeCareerInfo(connection,resumeId,companyId,companyName);
        console.log("Query3");
        const postEducationResult=await resumeDao.postResumeEducationInfo(connection,resumeId,schoolName);
        console.log("Query4");
        for (let index = 0; index < skills.length; index++) {
            const postResumeSkillResult=await resumeDao.postResumeSkillInfo(connection,resumeId,skills[index]);    
        }

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
        const BookMarkCount=await employmentDao.getBookMarkCount(connection,employmentId);
        BookMarkCount=BookMarkCount+1;
        console.log("2번 함수 호출성공");
        console.log(BookMarkCount);
        const postBookMarkCountResult=await employmentDao.plusBookMarkCount(connection,employmentId,BookMarkCount);
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
        const HeartCount=await employmentDao.getHeartCount(connection,employmentId);
        console.log("2번 함수 호출성공");
        console.log(HeartCount);
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
        const postFollowCountResult=await companyDao.plusFollowCount(connection,companyId,followCount);
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