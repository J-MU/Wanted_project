async function getFollowCount(connection,companyId){
  
    const getFollowCountQuery = `

        SELECT followCount
            FROM Companies
            WHERE companyId=${companyId}
    `;

    console.log(getFollowCountQuery);
    const getFollowCountResult = await connection.query(getFollowCountQuery);
    const FollowCount=getFollowCountResult[0][0].followCount;
    return FollowCount;
  
}

async function updateFollowCount(connection,companyId,followCount) {
    
    const updateFollowCountQuery = `
            UPDATE WANTED.Companies
            SET Companies.followCount=${followCount}
            WHERE Companies.companyId=${companyId};
         `;
    const updateFollowCountResult = await connection.query(updateFollowCountQuery);
    
    return updateFollowCountResult[0];
}


module.exports = {
    getFollowCount,
    updateFollowCount,
}