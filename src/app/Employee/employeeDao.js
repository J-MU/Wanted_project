

async function getPeriod (connection,interval) {
    const  getPeriodQuery = `
        SELECT CONCAT(LEFT(NOW() - INTERVAL ${interval} MONTH,7),'-01') AS 'DATE',
        DATE_FORMAT(CONCAT(LEFT(NOW() - INTERVAL ${interval} MONTH,7),'-01'),"%b-%y") AS 'DATE_FORMAT';
    `;

    const  period = await connection.query(getPeriodQuery);   
    return  period[0][0];
}

async function analysisEmployees (connection,date) {
    const  getAnalysisEmployeeQuery = `
        select count(employeeId) AS 'count' from Employees
        where (ISNULL(firedAt) OR TIMEDIFF(firedAt,"${date}")>0) AND TIMEDIFF(hiredAt,"${date}")<=0;
    `;

    console.log("Query: ",getAnalysisEmployeeQuery);

    const  Analysis = await connection.query(getAnalysisEmployeeQuery);   
    return  Analysis[0][0];
}

module.exports = {
    getPeriod,
    analysisEmployees,
}