const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

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
    console.log(req.body);
    
    // name 빈 값 체크
    if (!name)
        return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));
    // phoneNumber 빈 값 체크
    // if (!phoneNumber)
    //     return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
    console.log("password:",password);
    //TODO phoneNumber Validation

    // phoneNumber 정규 표현식
    // if (!/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/.test(phoneNumber))
    //     return res.send(response(baseResponse.SIGNUP_PHONENUMBER_ERROR_TYPE));

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
    const {userId,JobGroupId,JobId,career,skills}=req.body;
    console.log("일단 이 함수 호출 된긴 했음.");
    console.log(req.body);

    console.log(skills);
    console.log(typeof skills);
    console.log(typeof userId);
    console.log(typeof JobGroupId);
    console.log(Array.isArray(skills));
    
    //NULL 체크
    if(!userId)
         return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if(!JobGroupId)
        return res.send(errResponse(baseResponse.JOB_GROUP_EMPTY));

    if(!JobId)
         return res.send(errResponse(baseResponse.JOB_EMPTY));

    if(!career)
        return res.send(errResponse(baseResponse.CAREER_EMPTY));

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
    //school->education
    //company->profiles
    /* email, 휴대폰 번호, self_introduction, 경력(회사명, 기간, 현재 재직 유무),학교,

    /* body: schoolName, companyName*/
    const {userId,userName,email,telephone,jobName,career,companyId,companyName,schoolName,skills}=req.body;
    // self_introduction="안녕하세요 o년차 oo입니다./ 안녕하세요 신입 oo 입니다."
    // 학교는 필수! company는 선택.!
    
    // company,skills는 NULL가능
    //NULL 체크
    if(!schoolName) //학교는 필수.
        return res.send(errResponse(baseResponse.EDUCATION_NAME_EMPTY));

    if(!email)
        return res.send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
    
    if(!telephone)
        return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
    
    if(!jobName)
        return res.send(errResponse(baseResponse.JOB_EMPTY));
    
    if(!career)
        return res.send(errResponse(baseResponse.CAREER_EMPTY));
    
    if(!userId)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if(!userName)
        return res.send(errResponse(baseResponse.USER_NAME_EMPTY));

    const postSchoolAndCompanyResponse = await userService.postDefaultResume(
        userId,userName,email,telephone,jobName,career,companyId,companyName,schoolName,skills
    );

    return res.send(postSchoolAndCompanyResponse);
}

exports.postInterestedTags = async function (req, res) {
    const {userId,postTagList} = req.body;
    console.log(req.body);
    console.log(userId);
    console.log(postTagList);

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!postTagList) return res.send(errResponse(baseResponse.POST_TAG_EMPTY));


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

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.body.userId;
    const employmentId=req.body.employmentId;
   

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
   

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
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
   

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
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
   

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {

        const deleteFollowResult = await userService.deleteFollow(userId,companyId);
        return res.send(deleteFollowResult);
    }
};

exports.isMember = async function (req, res) {

    const email = req.params.email;
    
   
    const memberRows = await userProvider.emailCheck(email);
    const memberCount=memberRows.length;
    if(memberCount>0)
        return res.send(response(baseResponse.HAVE_REDUCTION_USER));
    else
        return res.send(response(baseResponse.NO_REDUCTION_USER));

};







/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
