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
//회사 검색
async function getCompanies (connection) {
    const  getCompaniesQuery = `
        select companyName, companyId
        from Companies;
    `;

    const  getCareerCompaniesRows = await connection.query(getCompaniesQuery);

    return  getCareerCompaniesRows[0]
}

async function getCompaniesUsingTag (connection,tagId,userId) {
    const  getCompaniesUsingTagQuery = `
        SELECT 
            Companies.companyId,
            companyName,
            Logo,
            IF(IsFollow.userId,true,false) as IsFollow
        FROM Companies
        LEFT JOIN (
        select * from Follow
        WHERE status='ACTIVE' AND userId=${userId}
        )IsFollow on IsFollow.companyId=Companies.CompanyId
        LEFT JOIN CompanyTagsMapping CTM on Companies.CompanyId = CTM.companyId
        LEFT JOIN CompanyTags CT on CTM.tagId = CT.tagId
        WHERE CT.tagId=${tagId};
    `;

    const  companyRows = await connection.query(getCompaniesUsingTagQuery);

    return  companyRows[0];
}


async function getCompaniesTag (connection,companyId) {
    const  getCompaniesTagQuery = `
        SELECT CompanyTags.tagId,name FROM Companies
        LEFT JOIN CompanyTagsMapping ON Companies.CompanyId=CompanyTagsMapping.companyId
        LEFT JOIN CompanyTags ON CompanyTagsMapping.tagId=CompanyTags.tagId
        WHERE Companies.CompanyId=${companyId};
    `;

    const  companyTagsRows = await connection.query(getCompaniesTagQuery);

    return  companyTagsRows[0];
}


async function getTagInfo (connection,tagId) {
    const  getTagInfoQuery = `
        select tagId,name from CompanyTags
        where tagId=${tagId};
    `;

    const  tagInfo = await connection.query(getTagInfoQuery);

    return  tagInfo[0][0];
}


async function getRandomTags (connection,tagId) {
    const  getRandomTagsQuery = `
        select tagId,name from CompanyTags
        WHERE tagId!=${tagId}
        ORDER BY RAND()
        LIMIT 4;
    `;

    const  randomTags = await connection.query(getRandomTagsQuery);

   console.log("RandomTags: ");
   console.log(randomTags[0]);
   
    return  randomTags[0];
}
async function getCompanyDetails(connection,userId,companyId){
    const  getCompanyDetailsQuery = `
        SELECT 
            companyName,
            Logo,
            description,
            IF(IsFollow.userId,true,false) as IsFollow
        FROM Companies
        LEFT JOIN (
        select * from Follow
        WHERE status='ACTIVE' AND userId=${userId}
        )IsFollow on IsFollow.companyId=Companies.CompanyId
        WHERE Companies.CompanyId=${companyId};  
    `;

    const  companyDetails = await connection.query(getCompanyDetailsQuery);

    console.log("companyDetails: ");
    console.log(companyDetails[0]);

    return  companyDetails[0];
}


async function getCompanyImgs(connection,companyId){
    const  getCompanyImgsQuery = `
        SELECT
            imgUrl
        FROM CompanyImgs
        WHERE companyId=${companyId}; 
    `;

    const  companyImgs = await connection.query(getCompanyImgsQuery);

    console.log("companyImgs: ");
    console.log(companyImgs[0]);

    return  companyImgs[0];
}


async function getEmploymentsOfCompany(connection,userId,companyId){
    const  getEmploymentsOfCompanyQuery = `
            SELECT
                Employments.employmentId,
                jobName,
                dueDate, # dueDate 상시채용 생각하기.
                (recommenderSigningBonus+Employments.recommendedSigningBonus) as 'SigningBonus',
                IF(IsBookMark.userId,true,false) as isBookMark
            FROM Employments
            LEFT JOIN Companies C on Employments.companyId = C.CompanyId
            LEFT JOIN (
                select * from WANTED.BookMark
                where status='ACTIVE' and userId=${userId}
            )IsBookMark on IsBookMark.employmentId=Employments.employmentId
            WHERE C.CompanyId=${companyId}
            ORDER BY Employments.createdAt
            LIMIT 4;
    `;

    const  employmentsOfCompany = await connection.query(getEmploymentsOfCompanyQuery);

    console.log("employmentsOfCompany: ");
    console.log(employmentsOfCompany[0]);

    return  employmentsOfCompany[0];
}


async function getCompanyNews(connection,companyId){
    const  getCompanyNewsQuery = `
        select newsName,newsFullUrl,newsUrl,uploadDate from CompanyNews
        LEFT JOIN Companies C on CompanyNews.companyId = C.CompanyId
        WHERE C.CompanyId=${companyId}
        LIMIT 4;
    `;

    const  companyNews = await connection.query(getCompanyNewsQuery);

    console.log("companyNews: ");
    console.log(companyNews[0]);

    return  companyNews[0];
}


module.exports = {
    getFollowCount,
    updateFollowCount,
    getCompanies,
    getCompaniesUsingTag,
    getCompaniesTag,
    getTagInfo,
    getRandomTags,
    getCompanyDetails,
    getCompanyImgs,
    getEmploymentsOfCompany,
    getCompanyNews,
}