async function getSchools  (connection, schoolName) {

    const   getSchoolsQuery = `
        select name
        from school
        where name LIKE '%${schoolName}%';
    `;

    const  getSchoolsRows = await connection.query(getSchoolsQuery, schoolName);

    return  getSchoolsRows[0]
}

module.exports = {
    getSchools
}