const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const secret_config = require("../../../config/secret");

const util = require('util');
const employmentDao = require("./employmentDao");
const skillDao=require("../Skill/skillDao");

const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
// Provider: Read 비즈니스 로직 처리

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
            totalData.recommendEmployment=await employmentDao.getExampleEmployment(connection,userId);
            totalData.recommendHighPassRateEmployment=await employmentDao.getExampleEmployment(connection,userId);
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
        totalData.hotPosition=await employmentDao.getExampleEmployment(connection,userId);
        console.log(util.inspect(totalData, {showHidden: false, depth: null, colors: true}))
        
        connection.release();

        
       

        return totalData;
    }catch(err){
        logger.error(`App - Get Employment Categories Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
