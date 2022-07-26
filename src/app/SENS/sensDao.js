async function setHistory(connection,userId,code,expiredAt) {
    console.log("SQL 실행");
    const setHistoryQuery = `
        INSERT INTO SensHistory(userId,code,expiredAt)
        VALUES(${userId},${code},"${expiredAt}");
    `;
    const result = await connection.query(setHistoryQuery);
    return result;
  }

async function getAuthenticationResult(connection,userId,code,expiredAt) {
console.log("SQL 실행");
console.log(expiredAt);

    const getAuthenticationResultQuery = `
        SELECT * FROM SensHistory
        WHERE userId=${userId} and code=${code} and TIMEDIFF(expiredAt,"${expiredAt}")<"00:05:00"
    `;
    console.log(getAuthenticationResultQuery);
const result = await connection.query(getAuthenticationResultQuery);
return result[0];
}

async function getCurrentTime(connection) {
    console.log("SQL 실행");
    
        const getCurrentTimeQuery = `
            SELECT CURRENT_TIMESTAMP;
        `;
        console.log(getCurrentTimeQuery);
    const result = await connection.query(getCurrentTimeQuery);
    return result[0][0].CURRENT_TIMESTAMP;
    }

module.exports = {
    setHistory,
    getAuthenticationResult,
    getCurrentTime,
}