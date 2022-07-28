const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const { insertUserSkills } = require("./userDao");
const { profile } = require("winston");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: name, phoneNumber, email, password, IsAcceptedPrivacyTerm, IsAcceptedMarketingTerm
     */
    const { name, phoneNumber, email, password, IsAcceptedPrivacyTerm, IsAcceptedMarketingTerm } = req.body;

    console.log("email:" , email);

    
    // name 빈 값 체크
    if (!name)
        return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));
    // phoneNumber 빈 값 체크
    if (!phoneNumber)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));

    // phoneNumber 정규 표현식
    if (!(/^01([0|1|6])([0-9]{3,4})([0-9]{4})$/.test(phoneNumber)))
    {

        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_ERROR_TYPE));
    }
    // 빈 값 체크
    // if (!email)
    //     return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // password 빈 값 체크
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // password 정규 표현식 (영문 숫자 특수문자 8자리 이상 포함)
    var regExp= /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

    if (!regExp.test(password))
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));

    //개인정보 동의
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    //약관동의 여부
    if (!IsAcceptedPrivacyTerm)
        return res.send(response(baseResponse.SIGNUP_AcceptedPrivacyTerm_EMPTY));

     const signUpResponse = await userService.createUser(
         name, phoneNumber, email, password, IsAcceptedPrivacyTerm, IsAcceptedMarketingTerm
    );

    return res.send(signUpResponse);
};


/**
 * 
 * API NO.2
 * API Name : 유저 프로필 생성 API(회원가입 과정2)
 * [POST] /app/users/jobcategory
 */
exports.postJobCatgory=async function(req,res){
    /* body: JobGroup, Job, career(년차), skills[]  */
    const {userId,JobGroupId,JobId,career,comapnyId,companyName,skills}=req.body;
    console.log("일단 이 함수 호출 된긴 했음.");
    console.log(req.body);

    console.log(skills);
    console.log(typeof skills);
    console.log(typeof userId);
    console.log(typeof JobGroupId);
    console.log(Array.isArray(skills));

    // NULL 체크
    if(!req.body)   return res.send(errResponse(baseResponse.BODY_EMPTY));
    if(!userId)     return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!JobGroupId) return res.send(errResponse(baseResponse.JOB_GROUP_EMPTY));
    if(!JobId)      return res.send(errResponse(baseResponse.JOB_EMPTY));
    if(!career)     return res.send(errResponse(baseResponse.CAREER_EMPTY));
    if(!skills)     return res.send(errResponse(baseResponse.SKILLS_NOT_EXIST));
    if(!Array.isArray(skills))   return res.send(errResponse(baseResponse.SKILLS_MUST_SEND_ARRAY));
    if(skills.length<=0)    return res.send(errResponse(baseResponse.SKILLS_EMPTY));
    if((!companyId && !companyName) || (companyId && companyName)) return res.send(errResponse(baseResponse.BOTH_OR_NONE_COMAPNY));
    console.log(req.body);

    const postJobCatgoryResponse=await userService.postJobCatgory(
        userId,
        JobGroupId,
        JobId,
        career,
        skills
    );

    return res.send(postJobCatgoryResponse);
}

/**
 *
 * API NO.3
 * API Name : 회원가입3 학교 직장 설정
 * [POST] /app/users/school-and-company
 */

exports.postDefaultResume=async function(req,res){
    console.log("test1");
    console.log("이게 맞긴 해..?");
    const userIdFromJWT = req.verifiedToken.userId;
    let postSchoolAndCompanyResponse;
    //school->education
    //company->profiles
    /* email, 휴대폰 번호, self_introduction, 경력(회사명, 기간, 현재 재직 유무),학교,

    /* body: schoolName, companyName*/
    const {userId,userName,email,telephone,jobId,career,companyId,companyName,schoolName,skills}=req.body;
    // self_introduction="안녕하세요 o년차 oo입니다./ 안녕하세요 신입 oo 입니다."
    // 학교는 필수! company는 선택.!
    
    // company,skills는 NULL가능
    //NULL 체크
    if(!schoolName) return res.send(errResponse(baseResponse.EDUCATION_NAME_EMPTY));
    if(!email)  return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
    if(!telephone)  return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
    if(!jobId)  return res.send(errResponse(baseResponse.JOB_EMPTY));
    if(!career && career!=0) return res.send(errResponse(baseResponse.CAREER_EMPTY));
    if(!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!userName)   return res.send(errResponse(baseResponse.USER_NAME_EMPTY));
    if((!companyId && companyName) || (companyId && !companyName) ) return res.send(errResponse(baseResponse.CANT_SEND_ONE_OF_COMPANYID_OR_COMPANYNAME));
    
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {

        postSchoolAndCompanyResponse = await userService.postDefaultResume(
            userId,userName,email,telephone,jobId,career,companyId,companyName,schoolName,skills
        );

    }


    return res.send(postSchoolAndCompanyResponse);
}

exports.postInterestedTags = async function (req, res) {
    const {userId,postTagList} = req.body;
    console.log(req.body);
    console.log(userId);
    console.log(postTagList);

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!postTagList) return res.send(errResponse(baseResponse.POST_TAG_EMPTY));
    if(postTagList.length==0)   return res.send(response(baseResponse.SUCCESS_HAVE_NOT_WORKING));

    const postInterestedTagsResult = await userService.postInterestedTags(userId,postTagList);
    return res.send(response(baseResponse.SUCCESS));
}
/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    var regExp= /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

    if (!regExp.test(password))
        return res.send(response(baseResponse.SIGNIN_PASSWORD_ERROR_TYPE));
    
    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};


/**
 * API No. 4
 * API Name : 북마크 등록 API
 * [POST] /app/users/:userid/bookmark
 * path variable : userId
 * 
 */
exports.postBookMark = async function (req, res) {

    // jwt - userId, path variable :userId
    console.log("이게 들어는 오나요~~~~?");
    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.body.userId;
    const employmentId=req.body.employmentId;
    console.log("id:",userIdFromJWT,userId);
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {

        const postBookMarkResult = await userService.postBookMark(userId,employmentId);
        return res.send(postBookMarkResult);
    }
};

exports.postHeart = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.body.userId;
    const employmentId=req.body.employmentId;
   

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {

        const postHeartResult = await userService.postHeart(userId,employmentId);
        return res.send(postHeartResult);
    }
};

exports.postFollow = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.body.userId;
    const companyId=req.body.companyId;
   
    if(!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!companyId) return res.send(errResponse(baseResponse.COMPANY_EMPTY));
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {

        const postFollowResult = await userService.postFollow(userId,companyId);
        return res.send(postFollowResult);
    }
};

exports.deleteBookMark = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const employmentId=req.params.employmentId;
   
    if(!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {

        const deleteBookMarkResult = await userService.deleteBookMark(userId,employmentId);
        return res.send(deleteBookMarkResult);
    }
};

exports.deleteHeart = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const employmentId=req.params.employmentId;
   

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {

        const deleteHeartResult = await userService.deleteHeart(userId,employmentId);
        return res.send(deleteHeartResult);
    }
};


exports.deleteFollow = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const companyId=req.params.companyId;
   if(!userId)      return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
   if(!companyId)   return res.send(errResponse(baseResponse.COMPANY_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {

        const deleteFollowResult = await userService.deleteFollow(userId,companyId);
        return res.send(deleteFollowResult);
    }
};

exports.isMember = async function (req, res) {

    const email = req.params.email;
    
   
    const memberRows = await userProvider.emailCheck(email);
    console.log(memberRows);
    const memberCount=memberRows.length;
    if(memberCount>0)
        return res.send(response(baseResponse.HAVE_REDUCTION_USER));
    else
        return res.send(response(baseResponse.NO_REDUCTION_USER));

};

exports.getProfileData = async function (req, res) {
    console.log("왜 뭐가 아무것도 아 미치것따.")
    console.log("여기들어오는건 맞지...?");
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    let profileData;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } 
    console.log("TEST:",userId,userIdFromJWT);
    const userStatus=await userProvider.getUserStatus(userId);
    console.log("여기 돌아는 왔니?");
    console.log(userStatus);
    //어느 Provider function을 호출할지를 결정해야함.
    if(userStatus=="STEP2"){
        console.log("STEP2");
        profileData=await userProvider.getProfileDataSTEP2(userId); // 여기 구현 완료!!
        console.log("profileData");
        console.log(profileData);
    }
    else if(userStatus=="ACTIVE"){
        console.log("ACTIVE");
        profileData=await userProvider.getProfileDataACTIVE(userId);
    }else{
        return res.send(errResponse(baseResponse.USER_STATUS_TYPE_ERROR));
    }


    console.log("userStatus: ",userStatus);
    return res.send(profileData);

    
};


exports.patchProfileImg=async function (req,res){
    const userId=req.verifiedToken.userId;
    const profileImgUrl=req.body.profileImg;

    if(!profileImgUrl) return res.send(errResponse(baseResponse.PROFILE_IMG_EMPTY));
    const insertProfileImgResult=await userService.patchProfileImg(userId,profileImgUrl);

    return res.send(insertProfileImgResult);
}

exports.patchProfile=async function(req,res){
    const userId=req.params.userId;
    const userIdFromJWT=req.verifiedToken.userId;
    console.log("여기까진 왔을까? 궁금해");
    console.log(userId,userIdFromJWT);
    console.log(req.body);
    
    if (userIdFromJWT != userId)  res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!req.body) return res.send(response(baseResponse.BODY_EMPTY));
    if(!req.body.userName)  return res.send(response(baseResponse.USER_NAME_EMPTY));
    if(!req.body.userEmail) return res.send(response(baseResponse.USER_EMAIL_EMPTY));
    if(!req.body.userPhoneNumber) return res.send(response(baseResponse.USER_PHONENUMBER_EMPTY));
    
    const userName=req.body.userName;
    const userEmail=req.body.userEmail;
    const userPhoneNumber=req.body.userPhoneNumber;

    const patchProfileResult=await userService.updateProfileInfo(userId,userName,userEmail,userPhoneNumber);
    
    return res.send(patchProfileResult);
}


exports.patchProfileSpec=async function(req,res){
    const userId=req.params.userId;
    const userIdFromJWT=req.verifiedToken.userId;
    console.log("여기까진 왔을까? 궁금해");
   /* userId,JobGroupId,JobId,career,skills
      salary,salaryPeriod,monetary);
   */
    console.log(req.body);
    console.log("id: ",userId,userIdFromJWT);
    if (userIdFromJWT != userId)  return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!req.body) return res.send(response(baseResponse.BODY_EMPTY));
    if(!req.params.userId)  return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(!req.body.jobGroupId) return res.send(response(baseResponse.JOB_GROUP_EMPTY));
    if(!req.body.jobId) return res.send(response(baseResponse.JOB_EMPTY));
    if(!req.body.career) return res.send(response(baseResponse.CAREER_EMPTY));
    if(!req.body.skills) return res.send(response(baseResponse.SKILLS_EMPTY));
    
    let profileObject;
    try{
        profileObject=await userProvider.getProfileInfoUsingUserId(userId);
        if(!profileObject)
            return res.send(errResponse(baseResponse.USER_ID_NOT_EXIST_IN_DB));

        console.log("profileObject: ",profileObject);
    }catch(err){
        if(err=="getProfileInfoFail") return res.send(errResponse({"isSuccess":false,"code":4001,"message":"fail getProfileInfo Query"}));
    }

    const params={};

    if(Array.isArray(req.body.skills)){
        params.skills=req.body.skills;
    }else{
        params.skills=[req.body.skills];
    }
    params.userId=userId;
    params.jobGroupId=req.body.jobGroupId;
    params.jobId=req.body.jobId;
    params.career=req.body.career;

    params.salary=req.body.salary ? req.body.salary : null;
    params.salaryPeriod=req.body.salaryPeriod ? req.body.salaryPeriod : null;
    params.monetary=req.body.monetary ? req.body.monetary : null;
    params.profileId=profileObject.profileId ? profileObject.profileId : null;

    console.log("Params: \n",params);
    let patchProfileResult;

    try{
        patchProfileResult=await userService.updateProfileSpecInfo(params);
    }catch(err){
        if(err=="updateProfileDataFail") return errResponse({"isSuccess":false,"code":4002,"message":"fail updateProfileData Query"});
        if(err=="updateJobGroupFail") return errResponse({"isSuccess":false,"code":4003,"message":"fail updateJobGroup Query"});
        if(err=="updateJobFail") return errResponse({"isSuccess":false,"code":4004,"message":"fail updateJob Query"});
        if(err=="deleteSkillsFail") return errResponse({"isSuccess":false,"code":4005,"message":"fail deleteSkills Query"});
        if(err=="newPostSkillsFail") return errResponse({"isSuccess":false,"code":4006,"message":"fail newPostSkills Query"});
    }
    
    return res.send(patchProfileResult);
}

exports.getUserInfo=async function(req,res){
    const userId=req.params.userId;
    const userIdFromJWT=req.verifiedToken.userId;
    console.log("여기까진 왔을까? 궁금해");
    console.log(req.url);
    if (userIdFromJWT != userId)  res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    
    const userInfoResult=await userProvider.getUserInfo(userId);
    
    return res.send(userInfoResult);
}

exports.postApplication=async function(req,res){
    const userIdFromJWT=req.verifiedToken.userId;
    const userId=req.body.userId;
    const resumeId=req.body.resumeId;
    const employmentId=req.body.employmentId;

    if(!req.body)   res.send(errResponse(baseResponse.BODY_EMPTY));
    if(!req.body.resumeId)  res.send(errResponse(baseResponse.RESUMEID_EMPTY));
    if(!req.body.employmentId)  res.send(errResponse(baseResponse.EMPLOYMENT_ID_EMPTY));
    if (userIdFromJWT != userId)  res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const suggestApplicationResult=await userService.postApplication(resumeId,employmentId);

    return res.send(suggestApplicationResult);
}

exports.cancleApplication=async function(req,res){
    // TODO verifiedToken req.verified가 존재하는가? 구현
    const userIdFromJWT=req.verifiedToken.userId;
    const userId=req.body.userId;
    const applicationId=req.body.applicationId;

    if(!userId)  res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!applicationId) res.send(errResponse(baseResponse.APPLICATION_ID_EMPTY));
    // ApplicationId NULL check
    if (userIdFromJWT != userId)  res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const suggestApplicationResult=await userService.cancleApplication(applicationId);

    return res.send(suggestApplicationResult);
}

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
