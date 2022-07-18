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
    const {userId,JobGroup,Job,career,skills}=req.body;

    console.log(req.body);
    
    //NULL 체크
    if(!userId)
         return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if(!JobGroup)
        return res.send(errResponse(baseResponse.JOB_GROUP_EMPTY));

    if(!Job)
         return res.send(errResponse(baseResponse.JOB_EMPTY));

    if(!career)
        return res.send(errResponse(baseResponse.CAREER_EMPTY));

    

    const postJobCatgoryResponse=await userService.postJobCatgory(
        userId,
        JobGroup,
        Job,
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

exports.postSchoolAndCompany=async function(req,res){
    console.log("test1");
    //school->education
    //company->profiles

    /* body: name, company*/
    const {name, company}=req.body;

    //NULL 체크
    if(!name)
        return res.send(errResponse(baseResponse.EDUCATION_NAME_EMPTY));

    if(!company)
        return res.send(errResponse(baseResponse.COMPANY_EMPTY));

    const postSchoolAndCompanyResponse = await userService.postSchoolAndCompany(
        name, company
    );

    return res.send(postSchoolAndCompanyResponse);
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











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
