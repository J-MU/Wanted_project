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

async function getRandomCompanies(connection,userId) {
    console.log("랜덤 컴퍼니 SQL 호출"); 
    const getCompaniesQuery = `
                SELECT Companies.CompanyId,
                companyName,
                CompanyFirstImg.imgUrl,
                Logo,
                IF(IsFollow.userId,true,false) as isFollow
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
            ORDER BY RAND()
            LIMIT 5;
         `;

    const randomCompanies = await connection.query(getCompaniesQuery);
    
    return randomCompanies[0];
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
    console.log("Query 시작");
    console.log(params.userId);

    let baseQuerycondition=` AND userId=${params.userId}`;
    let countryWhereQuery="";
    let cityWhereQuery="";
    let regionWhereQuery="";
    let careerWhereQuery="";
    let jobGroupWhereQuery="";
    let jobWhereQuery= "";
    let companyTagQuery="";
    let companyTagCondition=``;
    let skillTagQuery="";
    let skillTagCondition=``;
    let orderByQuery=``;

    
    if(params.country) countryWhereQuery=` AND Employments.country="${params.country}" `;
    if(params.city) cityWhereQuery=` AND Employments.city="${params.city}"`;
    if(params.region && params.region!="all") regionWhereQuery=` AND Employments.region="${params.region}"`;
    if(params.career) careerWhereQuery=` AND Employments.career>=${params.career}`;
    if(params.jobGroupId) jobGroupWhereQuery=` AND JGC.jobGroupCategoryId=${params.jobGroupId}`;
    if(params.jobId) jobWhereQuery= ` AND JC.categoryId=${params.jobId}`;     

    
    const baseWhereQuery=`
        WHERE 1=1`+
        countryWhereQuery+
        cityWhereQuery+
        regionWhereQuery+
        careerWhereQuery+
        jobGroupWhereQuery+
        jobWhereQuery;
        
    console.log("BaseWhereQuery:",baseWhereQuery);
    
    console.log(params.companyTagId);
    if(!params.companyTagId){
        companyTagCondition="1=1";
    }
    else if(!Array.isArray(params.companyTagId)){
        companyTagCondition=companyTagCondition+` tagId=${params.companyTagId}`;
    }else{
        for (let index = 0; index < params.companyTagId.length; index++) {
            if(index==0){
                companyTagCondition =companyTagCondition+ ` tagId=${params.companyTagId[index]}`;
                continue;
            }
            companyTagCondition =companyTagCondition+ ` OR tagId=${params.companyTagId[index]}`;
        }
    }
       
    
    companyTagQuery=`
        INNER JOIN (
        SELECT * FROM CompanyTagsMapping
        where 1=1 and (`+companyTagCondition+`)
        GROUP BY companyId
        )TM on TM.companyId=C.companyId`;

    console.log("companyTagQuery:",companyTagQuery);
   
    if(!params.skills){
        skillTagCondition="1=1";
    }
    else if(!Array.isArray(params.skills)){
        skillTagCondition=skillTagCondition+` skillId=${params.skills}`;
    }else{
        for (let index = 0; index < params.skills.length; index++) {
            if(index==0){
                skillTagCondition =skillTagCondition+ ` skillId=${params.skills[index]}`;
                continue;
            }
            skillTagCondition =skillTagCondition+ ` OR skillId=${params.skills[index]}`;
        }
    }


    skillTagQuery=`    
        INNER JOIN (
        select skillId,employmentId from EmploymentSkillMapping
        where 1=1 AND (`+skillTagCondition +`)
        Group By employmentId # 1 2 5 6 7 11 13
        )SM on SM.employmentId=Employments.employmentId
    `;

    console.log("skillTagQuery: ",skillTagQuery);
    console.log("orderBy:",params.orderBy);
    switch(params.orderBy){
        case '0':
            orderByQuery=" ORDER BY responseRate DESC";
            break;
        case '1':
            orderByQuery=" ORDER BY Employments.createdAt DESC"
            break;
        case '2':
            orderByQuery=" ORDER BY (Employments.recommenderSigningBonus+Employments.recommendedSigningBonus) DESC";
            break;
        case '3':
            orderByQuery="ORDER BY Employments.clickedCount DESC"
            break;
        default:
            console.error("OrderBy Error");

    }

    const totalQuery = `
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
            #CT.name, # 없어도 되는데 넣어놓은거 테스트용 3 
            Employments.responseRate, # 없어도 되는데 넣어놓은거 테스트용 4
            Employments.createdAt, # 없어도 되는데 넣어놓은거 테스트용 5
            Employments.clickedCount # 없어도 되는데 넣어놓은거 테스트용 6
        from WANTED.Employments
        LEFT JOIN Companies C
        on Employments.companyId = C.CompanyId
        LEFT JOIN (
            select * from WANTED.BookMark
            where  status='ACTIVE' `+baseQuerycondition+`
        )IsBookMark
        on IsBookMark.employmentId=Employments.employmentId
        LEFT JOIN JobCategories JC on Employments.categoryId = JC.categoryId
        LEFT JOIN JobGroupCategories JGC on JC.jobGroupCategoryId = JGC.jobGroupCategoryId`+
        companyTagQuery+
        skillTagQuery+
        baseWhereQuery
        +orderByQuery;
    
        
         
    console.log("Query:");
    console.log(totalQuery);
    const employmentsRows = await connection.query(totalQuery);
    
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
    getRandomCompanies,
  };
  


  