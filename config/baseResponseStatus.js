module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
    NO_REDUCTION_USER:{"isSuccess":true,"code":1001,"message":"중복 유저 없음"},
    HAVE_REDUCTION_USER:{"isSuccess":true,"code":1002,"message":"이미 가입된 유저"},
    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    //로그인 : 2000
    SIGNUP_NAME_EMPTY :  { "isSuccess": false, "code": 2001, "message":"이름을 입력해주세요" },
    SIGNUP_PHONENUMBER_EMPTY :  { "isSuccess": false, "code": 2002, "message":"전화번호를 입력해주세요" },
    SIGNUP_PHONENUMBER_ERROR_TYPE :  { "isSuccess": false, "code": 2003, "message":"전화번호 형식에 맞게 입력해주세요" },
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2004, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2005, "message":"이메일 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2006, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_ERROR_TYPE : { "isSuccess": false, "code": 2007, "message":"비밀번호 형식을 정확하게 입력해주세요." },
    SIGNUP_AcceptedPrivacyTerm_EMPTY : { "isSuccess": false, "code": 2008, "message":"약관동의 여부를 체크해주세요." },

    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_ERROR_TYPE : { "isSuccess": false, "code": 2011, "message":"비밀번호 형식을 정확하게 입력해주세요." },
    //userDomain/profie :2050
    CAREER_EMPTY:{"isSuccess": false, "code": 2050, "message":"경력(년차)를 입력해주세요"},
    EDUCATION_NAME_EMPTY : {"isSuccess": false, "code": 2051, "message":"학교를 입력해주세요."},
    COMPANY_EMPTY : {"isSuccess": false, "code": 2052, "message":"직장을 입력해주세요."},
    USER_EMAIL_EMPTY : {"isSuccess": false, "code": 2057, "message":"이메일을 입력해 주세요"},
    USER_PHONENUMBER_EMPTY:{"isSuccess": false, "code": 2057, "message":"휴대폰 번호를 입력해주세요"},
    // SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    // SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
   
    // SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2053, "message": "userId를 입력해주세요." },
    USER_NAME_EMPTY: { "isSuccess": false, "code": 2054, "message": "user 이름을 입력해주세요" },
    NOT_DEVELOPMENT_CANT_HAVE_SKILL:{"isSuccess": false, "code": 2055, "message": "직군이 개발이 아니면 skill을 등록할 수 없습니다."},
    USER_STATUS_TYPE_ERROR:{"isSuccess": false, "code": 2056, "message": "STATUS가 비정상적인 값입니다."},
    // USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    // Employments: 2100
    OUT_OF_CAREER_RANGE: {"isSuccess": false, "code": 2101, "message": "경력 범위를 벗어났습니다."},
    SEARCH_LOCATION_ERROR_TYPE:{"isSuccess": false, "code": 2102, "message": "Location 형식이 맞지않습니다."},
    EMPLOYMENT_ID_EMPTY:{"isSuccess": false, "code": 2103, "message": "채용 Id를 입력하시오"},

    // USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    // USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2014, "message": "유저 아이디 값을 확인해주세요" },
    // USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    // USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    //Post :2200
    POST_TAG_EMPTY:{"isSuccess": false, "code": 2200, "message": "태그를 입력해 주세요."},
    //Job,JobGroup :2300
    JOB_GROUP_EMPTY:{"isSuccess": false, "code": 2300, "message": "직군을 입력해주세요"},
    JOB_EMPTY:{"isSuccess": false, "code": 2301, "message": "직무를 입력해주세요"},
    OUT_OF_JOBGROUP_RANGE:{"isSuccess": false, "code": 2301, "message": "직군을 입력해주세요"},
    OUT_OF_JOB_RANGE:{"isSuccess": false, "code": 2301, "message": "직무를 입력해주세요"},
    NOT_INHERITANCE_CATEGORIES:{"isSuccess": false, "code": 2301, "message": "직무를 입력해주세요"},
    //resume : 2400
    RESUMEID_EMPTY : {"isSuccess": false, "code": 2400, "message": "이력서ID를 입력해주세요"},
    SCHOOLNAME_EMPTY  : {"isSuccess": false, "code": 2401, "message": "학교이름을 입력해주세요"},
    SELFINTRODUCTIONNUM_ERROR : {"isSuccess": false, "code": 2402, "message": "글자수 400자 미만은 이력서 작성을 완료할 수 없습니다."},
    INPUTDATE_ERROR :  {"isSuccess": false, "code": 2403, "message": "경력의 기간을 작성해주세요"},
    INPUTMAJOR_ERROR :  {"isSuccess": false, "code": 2404, "message": "전공 및 학위를 작성해주세요"},
    FAILED_ERROR : {"isSuccess": false, "code": 2405, "message": "작성완료를 하려면 빈 칸을 채워주세요."},
    AWARDSNAME_EMPTY : {"isSuccess": false, "code": 2406, "message": "활동명을 입력해주세요."},
    RESUME_USERID_EMPTY : {"isSuccess": false, "code": 2407, "message": "userId를 입력해주세요."},
    //company : 2150
    COMPANYNAME_EMPTY : {"isSuccess": false, "code": 2150, "message": "회사이름을 입력해주세요"},
    COMPANY_TAG_TOO_MANY: {"isSuccess": false, "code": 2151, "message": "company tag는 3개까지 선택 가능합니다."},
    COMPANY_TAG_EMPTY:{"isSuccess": false, "code": 2152, "message": "company tagId를 입력하세요"},

    // 기타 error
    OUT_OF_ORDER_BY_OPTION:{"isSuccess": false, "code": 2500, "message": "유효한 정렬 option이 아닙니다."},
    BODY_EMPTY:{"isSuccess": false, "code": 2501, "message": "BODY가 비었습니다."},
    SKILLS_EMPTY:{"isSuccess": false, "code": 2502, "message": "SKILL이 비었습니다."},
    SKILLS_NOT_EXIST:{"isSuccess": false, "code": 2503, "message": "SKILL배열을 보내주세요"},
    SKILLS_MUST_SEND_ARRAY:{"isSuccess": false, "code": 2504, "message": "SKILL을 배열로 보내주세요"},
    FILE_EMPTY:{"isSuccess": false, "code": 2505, "message": "File을 넣어주세요."},
    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },
    SIGNUP_REDUNDANT_PHONENUMBER: { "isSuccess": false, "code": 3003, "message":"중복된 휴대전화입니다." },
    // 3200 :post 오류

    POSTID_NOTEXIST :{ "isSuccess": false, "code": 3200, "message": "postId가 존재하지 않습니다." },


    //3400: resume 오류
    TAGID_NOTEXIST : { "isSuccess": false, "code": 3400, "message": "tagId가 존재하지 않습니다." },
    CAREERID_NOTEXIST : { "isSuccess": false, "code": 3401, "message": "careerId가 존재하지 않습니다." },
    EDUCATIONID_NOTEXIST : { "isSuccess": false, "code": 3402, "message": "educationId가 존재하지 않습니다." },
    AWARDSID_NOTEXIST : { "isSuccess": false, "code": 3403, "message": "awardsId가 존재하지 않습니다." },


    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },




    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
