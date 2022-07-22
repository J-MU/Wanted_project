const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const secret_config = require("../../../config/secret");

const util = require('util');

const jobProvider=require('../JobCategories/jobProvider');

const employmentDao = require("./employmentDao");
const skillDao=require("../Skill/skillDao");

const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
// Provider: Read 비즈니스 로직 처리

/* 상수 선언 */
const MAX_CAREER_SIZE=10;               // 신입(0)~10년 이상
const MAX_ORDER_BY_OPTION_SIZE=3;       // 0~3

exports.getDataForMainPage = async function (userId) {
    
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        /*
            받아와야하는 데이터.
            1. Carousel data 받아오기 OK
            2. employment data받아오기 정민욱님! 지금 바로 지원해볼까요?
            3. employment data 받아오기2 logo-wantedai가 제안하는 합격률 높은 포지션 
            4. theme 에 맞는 회사 데이터 받아오기. OK
            5. companyTag에 맞는 회사 데이터 받아오기. OK
            6. employment data 받아오기2 요즘 뜨는 포지션
        */
        const totalData={};

        console.log("여긴어디냐.");
        totalData.carousel=await employmentDao.getEmploymentCarouselData(connection);
        if(userId!=0){
            totalData.recommendEmployment=await employmentDao.getExampleEmployment(connection,userId,12);
            totalData.recommendHighPassRateEmployment=await employmentDao.getExampleEmployment(connection,userId,12);
        }
        console.log("여긴 여기지");
        const themeData=await employmentDao.getThemeData(connection);
        
        for (let index = 0; index < themeData.length; index++) {
            themeData[index].companyLogoList=await employmentDao.getCompanyLogo(connection,themeData[index].companyThemeId);
        }
        totalData.themeData=themeData;
        
        const tagIdList=[];
        let companyListMatchingTags;

        /*
            select tagId from Companies
            INNER JOIN CompanyTagsMapping
            on Companies.CompanyId=CompanyTagsMapping.companyId
            GROUP BY CompanyTagsMapping.tagId;
        *///위 커리를 통해 가용한 tagId를 받아올 수 있지만 3,4,2번 tagId만 DummyData가 여러개 들어있으므로 3,4,2로 고정한다.    
        tagList=[3,4,2];    //
        tagList.sort(() => Math.random() - 0.5);
        console.log(tagList);
        
        totalData.companiesMatchingTag1={};
        totalData.companiesMatchingTag2={};
        
        console.log("여기까지");
        let tagInfo=await employmentDao.getTagInfo(connection,tagList[0]);
        totalData.companiesMatchingTag1.tagId=tagInfo[0].tagId;
        totalData.companiesMatchingTag1.tagName=tagInfo[0].name;
        totalData.companiesMatchingTag1.tagURL=tagInfo[0].tagImgUrl;
        console.log("여기까진 왓ㄱㅆ지?")
        totalData.companiesMatchingTag1.companyList=await employmentDao.getCompaniesMatchingTag(connection,tagList[0],userId);

        tagInfo=await employmentDao.getTagInfo(connection,tagList[1]);
        totalData.companiesMatchingTag2.tagId=tagInfo[0].tagId;
        totalData.companiesMatchingTag2.tagName=tagInfo[0].name;
        totalData.companiesMatchingTag2.tagURL=tagInfo[0].tagImgUrl;
        totalData.companiesMatchingTag2.companyList=await employmentDao.getCompaniesMatchingTag(connection,tagList[1],userId);
        console.log("여기까지왔니?998")
        totalData.hotPosition=await employmentDao.getExampleEmployment(connection,userId,4);
        console.log(util.inspect(totalData, {showHidden: false, depth: null, colors: true}));
        
        connection.release();

        
       

        return totalData;
    }catch(err){
        logger.error(`App - Get Employment Categories Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.getEmployments = async function (params) {

    /*
        header: jwt VerifiedToken O
        Query String: 
                      jobGroupId,
                      jobId,country,
                      location(city.region),
                      companytagId(최대3개),
                      skillTagId,
                      career,
                      orderBy
    */

    /*
        validation: 
        1. joGroupId -> job범위안에 들어가있는지.                   SQL 필요.
        2. jobId -> job 범위안에 들어가 있는지.                     SQL 필요
        3. jobGroupId가 없는데 jobId가 들어오진 않았는지.           
        4. jobGroupId와 jobId가 부모자식 관계인지.                  SQL 필요.
        5. companyTagId가 3개이하인지.                             
        6. career가 0~10 사이인지. 
        7. order by가 0~3 사이인지.

    */
    // 1. jobGroupId -> job범위안에 들어가있는지. //TODO joId not null이면 적용.
    if((params.jobGroupId)&!(1<=params.jobGroupId & params.jobGroupId<=19)){
        return response(baseResponse.OUT_OF_JOBGROUP_RANGE);
    }

    //2. jobId -> job 범위안에 들어가 있는지. 
    if((params.jobId)&!(1<=params.jobId & params.jobId<=42))
        return response(baseResponse.OUT_OF_JOB_RANGE);

    //3. jobGroupId가 없는데 jobId가 들어오진 않았는지.
    if(params.jobId&(!params.jobGroupId)  )
        return response(baseResponse.JOB_GROUP_EMPTY);
    
    //4. jobGroupId와 jobId가 부모자식 관계인지
    if(params.jobGroupId & params.jobId){
        const isInheritance=await jobProvider.checkInheritanceJobandJobGroupCategory(params.jobId);
        console.log("isInheritance : ");
        console.log(isInheritance);
        if(!isInheritance)
            return response(baseResponse.NOT_INHERITANCE_CATEGORIES);
    }
    

    //5.  companyTagId가 3개 이하인지.
    if(params.companyTagId & params.campanyTagId.length>3)
        return response(baseResponse.COMPANY_TAG_TOO_MANY);
    
    //6. career가 0~10 사이인지.
    if(params.career & !(params.career>=0 & params.career<=MAX_CAREER_SIZE))
        return response(baseResponse.OUT_OF_CAREER_RANGE);

    //7. orderBy가 0~3사이인지.
    if(params.orderBy & !(params.orderBy>=0 & params.orderBy<=MAX_ORDER_BY_OPTION_SIZE))
        return response(baseResponse.OUT_OF_ORDER_BY_OPTION);


    try{
        const connection = await pool.getConnection(async (conn) => conn);
        
        
        totalData=await employmentDao.getEmployments(connection,params);

        connection.release();
        return elementsRow;
    }catch(err){
        logger.error(`App - Get Filtering Employments Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
