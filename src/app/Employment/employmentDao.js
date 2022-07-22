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

async function getCompaniesMatchingTag(connection,tagId,userId) {
    console.log(tagId,userId);
    const getCompaniesMatchingTagQuery = `
    SELECT Companies.CompanyId,
    companyName,
    CompanyFirstImg.imgUrl,
    Logo,
    IF(IsFollow.userId,true,false) as isFollow,
    CC.categoryName
FROM Companies
     LEFT JOIN CompanyTagsMapping CTM on Companies.companyId = CTM.companyId
     LEFT JOIN CompanyTags on CompanyTags.tagId=CTM.tagId
     LEFT JOIN (
         SELECT C.CompanyId,imgUrl FROM CompanyImgs
         JOIN Companies C on CompanyImgs.companyId = C.CompanyId
         GROUP BY C.companyId
     )CompanyFirstImg
     ON CompanyFirstImg.CompanyId=Companies.CompanyId
     LEFT JOIN (
         SELECT * FROM Follow
         WHERE userId=${userId}
     )IsFollow ON IsFollow.companyId=Companies.CompanyId
     LEFT JOIN CompanyCategoryMapping CCM on Companies.CompanyId = CCM.companyId
     LEFT JOIN CompanyCategory CC on CCM.categoryId = CC.categoryId
     WHERE CompanyTags.tagId=${tagId};
         `;
    const companiesMatchingTagRows = await connection.query(getCompaniesMatchingTagQuery);
    
    return companiesMatchingTagRows[0];
}

async function getTagInfo(connection,tagId) {
    console.log("여기까지2"); 
    const getCompaniesMatchingTagQuery = `
            select tagId,name,tagImgUrl from CompanyTags
            WHERE tagId=${tagId};
         `;
    const tagInfo = await connection.query(getCompaniesMatchingTagQuery);
    
    return tagInfo[0];
}

async function getExampleEmployment(connection,userId,limit) {
    let limitStr;

    
    limitStr=" LIMIT "+limit;
    
    

    const getCompaniesMatchingTagQuery = `
                SELECT      
                    Employments.employmentId,
                    jobName,
                    IF(responseRate>=95,"응답률 매우 높음",NULL) AS responseRate,
                    country,
                    city,
                    employmentImgUrl,
                    Employments.companyId,
                    C.companyName,
                    IF(IsBookMark.userId,true,false) as isBookMark
                    FROM WANTED.Employments
                    LEFT JOIN Companies C on Employments.companyId = C.CompanyId
                    LEFT JOIN (
                        select * from WANTED.BookMark
                        where userId=${userId} and status='ACTIVE'
                    )IsBookMark on IsBookMark.employmentId=Employments.employmentId
                    ORDER BY RAND()
         `+limitStr;

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
    const BookMarkCount=BookmarkCountResult[0][0].bookMarkCount; 
    return BookMarkCount;
}
async function getHeartCount(connection,employmentId) {
    
    const getHeartCountQuery = `
            SELECT heartCount
            FROM Employments
            WHERE employmentId=${employmentId}
         `;
    const heartCountResult = await connection.query(getHeartCountQuery);
    const heartCount=heartCountResult[0][0].heartCount; 
    return heartCount;
}

async function updateBookMarkCount(connection,employmentId,BookMarkCount) {
    
    const plusBookMarkCountQuery = `
            UPDATE WANTED.Employments
            SET Employments.bookMarkCount=${BookMarkCount}
            WHERE Employments.employmentId=${employmentId};
         `;
    const plusBookmarkCountResult = await connection.query(plusBookMarkCountQuery);
    
    return plusBookmarkCountResult[0];
}


async function updateHeartCount(connection,employmentId,heartCount) {
    
    const plusHeartCountQuery = `
            UPDATE WANTED.Employments
            SET Employments.heartCount=${heartCount}
            WHERE Employments.employmentId=${employmentId};
         `;
    const plusHeartCountResult = await connection.query(plusHeartCountQuery);
    
    return plusHeartCountResult[0];
}

async function getEmployments(connection,params) {
    
    const getEmploymentsUsingFilteringQuery = `
            select Employments.employmentId,
            jobName,
            employmentImgUrl,
            country,
            city,
            if(responseRate>=95,"응답률 매우 높음",null) as 응답률,
            recommendedSigningBonus+recommenderSigningBonus as "채용 보너스",
            C.companyName,
            C.companyId,
            IF(IsBookMark.userId,true,false) as isBookMark,
            JC.name ,# 없어도 되는데 넣어놓은거 테스트용
            JGC.name, # 없어도 되는데 넣어놓은거 테스트용2
        #       CT.name, # 없어도 되는데 넣어놓은거 테스트용 3
            Employments.responseRate, # 없어도 되는데 넣어놓은거 테스트용 4
            Employments.createdAt, # 없어도 되는데 넣어놓은거 테스트용 5
            Employments.clickedCount # 없어도 되는데 넣어놓은거 테스트용 6
        from WANTED.Employments
        LEFT JOIN Companies C
        on Employments.companyId = C.CompanyId
        LEFT JOIN (
            select * from WANTED.BookMark
            where userId=${params.userId} and status='ACTIVE'
        )IsBookMark
        on IsBookMark.employmentId=Employments.employmentId
        LEFT JOIN JobCategories JC on Employments.categoryId = JC.categoryId
        LEFT JOIN JobGroupCategories JGC on JC.jobGroupCategoryId = JGC.jobGroupCategoryId
        INNER JOIN (
        SELECT * FROM CompanyTagsMapping
        where tagId=2 or tagId=3
        GROUP BY companyId
        )TM on TM.companyId=C.companyId
        INNER JOIN (
        select skillId,employmentId from EmploymentSkillMapping
        where skillId=3 or skillId=4
        Group By employmentId # 1 2 5 6 7 11 13
        )SM on SM.employmentId=Employments.employmentId
        WHERE 1=1
        #
        #AND    Employments.country="${params.country}"                    # 한국 고쳐야함.
        #AND Employments.city="${params.city}"                          # 서울 고쳐야함.
        #AND Employments.career>=${params.career}                   # 경력
        #AND JGC.jobGroupCategoryId=${params.jobGroupCategoryId}    # 직군 선택
        #AND JC.categoryId=${params.jobCategoryId}                  # 직무 선택
        #AND (CT.tagId=3                               # tag는 3개 까지 가능
        #OR CT.tagId=2
        #OR CT.tagId=4)
        #ORDER BY responseRate DESC
        #ORDER BY Employments.createdAt DESC
        #ORDER BY (Employments.recommenderSigningBonus+Employments.recommendedSigningBonus) DESC
        ORDER BY Employments.clickedCount DESC
        ;
         `;
    const employmentsRows = await connection.query(getEmploymentsUsingFilteringQuery);
    
    return employmentsRows[0];
}


  module.exports = {
    getEmploymentCarouselData,
    getThemeData,
    getCompanyLogo,
    getCompaniesMatchingTag,
    getTagInfo,
    getExampleEmployment,
    updateBookMarkCount,
    getBookMarkCount,
    updateHeartCount,
    getHeartCount,
    getEmployments,
  };
  