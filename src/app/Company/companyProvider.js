const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const companyDao = require("./companyDao");
const employeeProvider=require("../Employee/employeeProvider");

const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

//이력서 회사 검색
exports.getCompanies = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getCompaniesResult = await companyDao.getCompanies(connection);
        connection.release();

        return response(baseResponse.SUCCESS,getCompaniesResult);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.getCompaniesUsingTag=async function(companyTagId,userId){
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const totalData={};

        const tagList=[];
        tagList[0]=await companyDao.getTagInfo(connection,companyTagId);
        const randomTagList=await companyDao.getRandomTags(connection,companyTagId);
        
        for (let index = 0; index < randomTagList.length; index++) {
            tagList.push(randomTagList[index]);   
        }
        totalData.tagList=tagList;


        const companyRows = await companyDao.getCompaniesUsingTag(connection,companyTagId,userId);
        console.log(companyRows);
        for (let index = 0; index < companyRows.length; index++) {
            companyRows[index].companyTags=await companyDao.getCompaniesTag(connection,companyRows[index].companyId);
        }
        totalData.companyRows=companyRows;

        
        console.log(totalData);
        connection.release();
        return response(baseResponse.SUCCESS,totalData);
    }
    catch(err) {
        logger.error(`App - get Companies Using Tag Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.getCompanyDetails = async function (userId,companyId) {
    try {
        const totalData={};
        const connection = await pool.getConnection(async (conn) => conn);
        totalData.CompanyDetails = await companyDao.getCompanyDetails(connection,userId,companyId);
        const companyImgs=await companyDao.getCompanyImgs(connection,companyId);
        
        totalData.companyImgs=[];
        for (let index = 0; index < companyImgs.length; index++) {
            totalData.companyImgs.push(companyImgs[index].imgUrl);
        }
       
        const companyTags=await companyDao.getCompaniesTag(connection,companyId);
        totalData.companyTags=companyTags;

        totalData.Employments=await companyDao.getEmploymentsOfCompany(connection,userId,companyId);
       
        /* 직원 분석 Data recieve Code*/
        const period=1;       // 1년
        const analysisType=1; // 전체 인원
        totalData.news=await companyDao.getCompanyNews(connection,companyId);
        totalData.AnalysisEmployees=await employeeProvider.getAnalysisEmployee(period,analysisType);


        connection.release();

        return response(baseResponse.SUCCESS,totalData);

    }
    catch(err) {
        logger.error(`App - GET Company Details Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}