async function getSchools  (connection) {
    let getSchoolsRows;
    const   getSchoolsQuery = `
        select name, schoolId
        from school
       ;
    `;

    try{
        getSchoolsRows = await connection.query(getSchoolsQuery);
    }catch(err){
        if(err=="getSchoolsFail") throw "getSchoolsFail"
    }

    return  getSchoolsRows[0]
}

module.exports = {
    getSchools
}