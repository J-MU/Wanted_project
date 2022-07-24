async function insertDummy (connection,hiredAt,salary) {
    const  insertDummyQuery = `
        INSERT INTO Employees(hiredAt, salary)
        VALUES("${hiredAt}",${salary});
    `;

    const  dummyRows = await connection.query(insertDummyQuery);

   console.log(dummyRows[0]);
   
    return  dummyRows[0];
}

async function firedDummy (connection,employmentId) {
    const  insertDummyQuery = `
        INSERT INTO Employees(hiredAt, salary)
        VALUES("${hiredAt}",${salary});
    `;

    const  dummyRows = await connection.query(insertDummyQuery);

   console.log(dummyRows[0]);
   
    return  dummyRows[0];
}

module.exports = {
    insertDummy,
}