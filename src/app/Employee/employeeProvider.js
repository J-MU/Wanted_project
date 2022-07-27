const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const employeeDao = require("./employeeDao");

const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

const ONE_YEAR=1;
const TWO_YEAR=2;
const THREE_YEAR=3;

const TOTAL_EMPLOYEE=1;
const ENTRANT=2; //입사자 수
const RETIREE=3; // 퇴사자 수


exports.getAnalysisEmployee=async function(period,analysisType,companyId){getAnalysisEmployeeFail
    
    console.log(period,analysisType);
    let periodArray=[];
    let periodFormatArray=[];
    let tempData={};
    const analysisEmployees=[];
    let tempDate={};
    let length;
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        // 입력한 period(년)에 맞게 x축 뽑아내는 코드
        for(let interval=1; interval<=period*12; interval++){
            tempDate=await employeeDao.getPeriod(connection,interval);
            console.log(tempDate);
            periodArray.push(tempDate.DATE);
            periodFormatArray.push(tempDate.DATE_FORMAT);
        }
        console.log("periodArray: ");
        console.log(periodArray);

        for(let index=periodArray.length-1; index>=0; index--){
             tempData.date=periodFormatArray[index];
             if(analysisType==TOTAL_EMPLOYEE){
                console.log("전체 인원수 조회");
                tempData.employeeNum=(await employeeDao.getAnalysisTotalEmployees(connection,periodArray[index],companyId)).count;
             }else if(analysisType==ENTRANT){
                console.log("입사자 수 조회");
                tempData.employeeNum=(await employeeDao.getAnalysisEntrantEmployees(connection,periodArray[index],companyId)).count;
             }else if(analysisType==RETIREE){
                console.log("퇴사자 수 조회");
                tempData.employeeNum=(await employeeDao.getAnalysisRetireeEmployees(connection,periodArray[index],companyId)).count;
             }
             console.log(tempData);
             analysisEmployees.push(tempData);
             tempData={};
       }
        
       console.log("analysis Employees:: !");
       console.log("analysis Employees:: !");
       console.log("analysis Employees:: !");
       console.log(analysisEmployees);

        connection.release();
        return analysisEmployees;

    }
    catch(err) {
        if(err=="getAnalysisTotalEmployeesFail") throw "getAnalysisTotalEmployeesFail";
        if(err=="getAnalysisEntrantEmployeesFail") throw "getAnalysisEntrantEmployeesFail";
        if(err=="getAnalysisRetireeEmployeesFail") throw "getAnalysisRetireeEmployeesFail";
        logger.error(`App - GET Company Details Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}