async function getFollowCount(connection,companyId){
  
    const getFollowCountQuery = `

        SELECT followCount
            FROM Companies
            WHERE companyId=${companyId}
    `;

    console.log(getFollowCountQuery);
    const getFollowCountResult = await connection.query(getFollowCountQuery);
    const FollowCount=getFollowCountResult[0][0].followCount+1;
    return FollowCount;
  
}

async function plusFollowCount(connection,companyId,followCount) {
    
    const plusFollowCountQuery = `
            UPDATE WANTED.Companies
            SET Companies.followCount=${followCount}
            WHERE Companies.companyId=${companyId};
         `;
    const plusFollowCountResult = await connection.query(plusFollowCountQuery);
    
    return plusFollowCountResult[0];
}


module.exports = {
    getFollowCount,
    plusFollowCount,
}