async function getSchools  (connection) {

    const   getSchoolsQuery = `
        select name, schoolId
        from school
       ;
    `;

    const  getSchoolsRows = await connection.query(getSchoolsQuery);

    return  getSchoolsRows[0]
}

module.exports = {
    getSchools
}