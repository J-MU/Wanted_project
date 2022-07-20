// 모든 유저 조회
async function getEmploymentCarouselData(connection) {
    const getEmploymentCarouselDataQuery = `
        select carouselId,imgUrl,title,content,link
        from Carousel
        WHERE page='EMPLOYMENT'
        ORDER BY RAND();
        
                  `;
    const EmploymentCarouselData = await connection.query(getEmploymentCarouselDataQuery);
    return EmploymentCarouselData[0];
}
async function getThemeData(connection) {
    const getThemeDataQuery = `
        SELECT companyThemeId,themeName,introduction,themeImgUrl FROM CompanyThemes;
        
         `;
    const ThemeData = await connection.query(getThemeDataQuery);
    return ThemeData[0];
}

async function getCompanyLogo(connection,companyThemeId) {
    const getCompanyLogoQuery = `
        SELECT Logo FROM Companies
        RIGHT JOIN CompanyThemeMapping CTM on Companies.CompanyId = CTM.companyId
        WHERE companyThemeId=${companyThemeId};
        
         `;
    const companyLogoRows = await connection.query(getCompanyLogoQuery);
    const companyLogoList=[];
    for (let index = 0; index < companyLogoRows[0].length; index++) {
        companyLogoList[index] = companyLogoRows[0][index].Logo;
    }
    return companyLogoList;
}

async function getCompaniesMatchingTag(connection,tagId) {
    const getCompaniesMatchingTagQuery = `
        SELECT Companies.CompanyId,companyName,CompanyFirstImg.imgUrl,Logo FROM Companies
        LEFT JOIN CompanyTagsMapping CTM on Companies.companyId = CTM.companyId
        LEFT JOIN CompanyTags on CompanyTags.tagId=CTM.tagId
        LEFT JOIN (
            SELECT C.CompanyId,imgUrl FROM CompanyImgs
            JOIN Companies C on CompanyImgs.companyId = C.CompanyId
            GROUP BY C.companyId
        )CompanyFirstImg
        ON CompanyFirstImg.CompanyId=Companies.CompanyId
        WHERE CompanyTags.tagId=${tagId};
         `;
    const companiesMatchingTagRows = await connection.query(getCompaniesMatchingTagQuery);
    
    return companiesMatchingTagRows[0];
}

async function getTagInfo(connection,tagId) {
    console.log("여기까지2"); 
    const getCompaniesMatchingTagQuery = `
            select tagId,name from CompanyTags
            WHERE tagId=${tagId};
         `;
    const tagInfo = await connection.query(getCompaniesMatchingTagQuery);
    
    return tagInfo[0];
}

async function getExampleEmployment(connection) {
    
    const getCompaniesMatchingTagQuery = `
            SELECT employmentId,
            jobName,
            IF(responseRate>=95,"응답률 매우 높음",NULL) AS responseRate,
            country,
            city,
            employmentImgUrl,
            Employments.companyId,
            C.companyName
            FROM WANTED.Employments
            LEFT JOIN Companies C on Employments.companyId = C.CompanyId
            ORDER BY RAND()
            LIMIT 12;
         `;
    const tagInfo = await connection.query(getCompaniesMatchingTagQuery);
    
    return tagInfo[0];
}

async function getBookMarkCount(connection,employmentId) {
    
    const getBookMarkCountQuery = `
            SELECT bookMarkCount
            FROM Employments
            WHERE employmentId=${employmentId}
         `;
    const BookmarkCountResult = await connection.query(getBookMarkCountQuery);
    const BookMarkCount=BookmarkCountResult[0][0].bookMarkCount+1; 
    return BookMarkCount;
}

async function plusBookMarkCount(connection,employmentId,BookMarkCount) {
    
    const plusBookMarkCountQuery = `
            UPDATE WANTED.Employments
            SET Employments.bookMarkCount=${BookMarkCount}
            WHERE Employments.employmentId=${employmentId};
         `;
    const plusBookmarkCountResult = await connection.query(plusBookMarkCountQuery);
    
    return plusBookmarkCountResult[0];
}

  module.exports = {
    getEmploymentCarouselData,
    getThemeData,
    getCompanyLogo,
    getCompaniesMatchingTag,
    getTagInfo,
    getExampleEmployment,
    plusBookMarkCount,
    getBookMarkCount,
  };
  