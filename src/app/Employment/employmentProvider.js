const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const util = require('util');
const employmentDao = require("./employmentDao");
const skillDao=require("../Skill/skillDao");
// Provider: Read 비즈니스 로직 처리

exports.getDataForMainPage = async function () {
    
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        /*
            받아와야하는 데이터.
            1. Carousel data 받아오기 OK
            2. employment data받아오기
            3. employment data 받아오기2
            4. theme 에 맞는 회사 데이터 받아오기.
            5. companyTag에 맞는 회사 데이터 받아오기.
        */
        const totalData={};
        totalData.carousel=await employmentDao.getEmploymentCarouselData(connection);
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
        

        const tagInfo=await employmentDao.getTagInfo(connection,tagList[0]);
        console.log("tagInfo:");
        console.log(tagInfo);

        totalData.companiesMatchingTag1.tagId=tagList[0];
        totalData.companiesMatchingTag1.companyList=await employmentDao.getCompaniesMatchingTag(connection,tagList[0]);


        totalData.companiesMatchingTag2.tagId=tagList[1];
        totalData.companiesMatchingTag2.companyList=await employmentDao.getCompaniesMatchingTag(connection,tagList[1]);
        
        
        console.log(util.inspect(totalData, {showHidden: false, depth: null, colors: true}))
        
        connection.release();

        
       

        return totalData;
    }catch(err){
        logger.error(`App - Get Employment Categories Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
