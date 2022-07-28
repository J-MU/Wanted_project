// 모든 유저 조회
async function getEmploymentCarouselData(connection) {
    let EmploymentCarouselData;
    const getEmploymentCarouselDataQuery = `
        select carouselId,imgUrl,title,content,link
        from Carousel
        WHERE page='EMPLOYMENT'
        ORDER BY RAND();
        
                  `;
    try{
        EmploymentCarouselData = await connection.query(getEmploymentCarouselDataQuery);
    }
    catch(err){
        throw "getEmploymentCarouselDataFail"
    }
    return EmploymentCarouselData[0];
}
async function getThemeData(connection) {
    let ThemeData;
    
    const getThemeDataQuery = `
        SELECT companyThemeId,themeName,introduction,themeImgUrl FROM CompanyThemes;
        
         `;
    try{
        ThemeData = await connection.query(getThemeDataQuery);
    }
    catch(err){
        throw "getThemeDataFail";
    }
    return ThemeData[0];
}

async function getCompanyLogo(connection,companyThemeId) {
    let companyLogoRows;

    const getCompanyLogoQuery = `
        SELECT Logo FROM Companies
        RIGHT JOIN CompanyThemeMapping CTM on Companies.CompanyId = CTM.companyId
        WHERE companyThemeId=${companyThemeId};
        
         `;
    try{
        companyLogoRows = await connection.query(getCompanyLogoQuery);
    }     
    catch(err){
        throw "getCompanyLogoFail"
    }
    const companyLogoList=[];
    for (let index = 0; index < companyLogoRows[0].length; index++) {
        companyLogoList[index] = companyLogoRows[0][index].Logo;
    }
    return companyLogoList;
}

async function getCompaniesMatchingTag(connection,tagId,userId) {
    console.log(tagId,userId);
    let companiesMatchingTagRows;
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
    try{
        companiesMatchingTagRows = await connection.query(getCompaniesMatchingTagQuery);
    }
    catch(err){
        throw "getCompaniesMatchingTagFail"
    }
    return companiesMatchingTagRows[0];
}

async function getTagInfo(connection,tagId) {
    let tagInfo;
    console.log("여기까지2"); 
    const getCompaniesMatchingTagQuery = `
            select tagId,name,tagImgUrl from CompanyTags
            WHERE tagId=${tagId};
         `;
    try{
        tagInfo = await connection.query(getCompaniesMatchingTagQuery);
    }
    catch(err){
        throw "getTagInfoFail";
    }
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
    let tagInfo;
    
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

    try{
        tagInfo = await connection.query(getCompaniesMatchingTagQuery);
    }
    catch(err){
        throw "getExampleEmploymentFail";
    }
    return tagInfo[0];
}

async function getBookMarkCount(connection,employmentId) {
    let BookmarkCountResult;
    const getBookMarkCountQuery = `
            SELECT bookMarkCount
            FROM Employments
            WHERE employmentId=${employmentId}
         `;
    try{
        BookmarkCountResult = await connection.query(getBookMarkCountQuery);
    }catch(err){
        throw "getBookMarkCountFail";
    }
    
    const BookMarkCount=BookmarkCountResult[0][0].bookMarkCount; 
    return BookMarkCount;
}
async function getHeartCount(connection,employmentId) {
    let heartCountResult;
    const getHeartCountQuery = `
            SELECT heartCount
            FROM Employments
            WHERE employmentId=${employmentId}
         `;
    try{
        console.log(getHeartCountQuery);
        heartCountResult = await connection.query(getHeartCountQuery);
    }catch(err){
        throw "getHeartCountFail";
    }
    const heartCount=heartCountResult[0][0].heartCount; 
    return heartCount;
}

async function updateBookMarkCount(connection,employmentId,BookMarkCount) {
    let plusBookMarkCountResult;

    const plusBookMarkCountQuery = `
            UPDATE WANTED.Employments
            SET Employments.bookMarkCount=${BookMarkCount}
            WHERE Employments.employmentId=${employmentId};
         `;
    try{
        plusBookmarkCountResult = await connection.query(plusBookMarkCountQuery);
    }catch(err){
        throw "updateBookMarkFail";
    }
    return plusBookmarkCountResult[0];
}


async function updateHeartCount(connection,employmentId,heartCount) {
    let plusHeartCountResult;
    const plusHeartCountQuery = `
            UPDATE WANTED.Employments
            SET Employments.heartCount=${heartCount}
            WHERE Employments.employmentId=${employmentId};
         `;
    try{
        plusHeartCountResult = await connection.query(plusHeartCountQuery);
    }catch(err){
        throw "updateHeartCountFail";
    }
    
    return plusHeartCountResult[0];
}


async function getEmploymentDetails(connection,employmentId,userId) {
    let EmploymentDetailsData;
    const getEmploymentDetailQuery = `
    SELECT
                Employments.employmentId,
                companyId,
                jobName,
                country,
                city,
                address,
                description,
                dueDate
                heartCount,
                recommenderSigningBonus,
                recommendedSigningBonus,
                IF(IsBookMark.userId,true,false) as isBookMark,
                IF(IsHeart.userId,true,false) as isHeart
                from Employments
                LEFT JOIN (
                    select * from WANTED.BookMark
                    where status='ACTIVE' and userId=${userId}
                )IsBookMark on IsBookMark.employmentId=Employments.employmentId
                LEFT JOIN (
                    select * from WANTED.Heart
                    WHERE status='ACTIVE' AND userId=${userId}
                )IsHeart on IsHeart.employmentId=Employments.employmentId
                WHERE Employments.employmentId=${employmentId};
         `;
    
    try{
        EmploymentDetailsData = await connection.query(getEmploymentDetailQuery);
    }catch(err){
        
        throw "getEmploymentDetailFail";
    }
    console.log("여기다!!!!");
    console.log(getEmploymentDetailQuery);
    return EmploymentDetailsData[0][0];
}
async function getRandomEmployments(connection,userId){
    let randomEmployments;
    const getRandomEmploymentsQuery=`
            SELECT Employments.employmentId,
            employmentImgUrl,
            country,
            jobName,
            city,
            (recommendedSigningBonus+Employments.recommenderSigningBonus) as SigningBonus,
            IF(IsBookMark.userId,true,false) as isBookMark,
            companyName
        FROM Employments
        LEFT JOIN Companies C on Employments.companyId = C.CompanyId
        LEFT JOIN (
                select * from WANTED.BookMark
                where  status='ACTIVE'  AND userId=${userId}
            )IsBookMark
        on IsBookMark.employmentId=Employments.employmentId
        ORDER BY RAND() LIMIT 8;
    `
    try{
        randomEmployments=await connection.query(getRandomEmploymentsQuery);
    }catch(err){
        throw "getRandomEmploymentsFail";
    }
    

    return randomEmployments[0];

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

async function getCompanyDetails(connection,companyId,userId) {
    let companyDetailsData;
    const getCompanyDetailsQuery = `
            SELECT 
            companyName,
            CC.categoryName,
            Logo,
            IF(IsFollow.userId,true,false) as IsFollow
            FROM Companies
            LEFT JOIN CompanyCategoryMapping CCM on Companies.CompanyId = CCM.companyId
            LEFT JOIN CompanyCategory CC on CCM.categoryId = CC.categoryId
            LEFT JOIN (
            select * from Follow
            WHERE status='ACTIVE' AND userId=${userId}
            )IsFollow on IsFollow.companyId=Companies.CompanyId
            WHERE Companies.companyId=${companyId};
         `;
    try{
        companyDetailsData = await connection.query(getCompanyDetailsQuery);
    }catch(err){
        throw "getCompanyDetailsFail";
    }
    
    return companyDetailsData[0][0];
}

async function getCompanyTag(connection,companyId) {
    console.log("Query3 시작")
    let companyTagData;
    const getCompanyTagQuery = `
            SELECT CT.tagId,CT.name FROM Companies
            LEFT JOIN CompanyTagsMapping ON Companies.CompanyId=CompanyTagsMapping.companyId
            LEFT JOIN CompanyTags CT on CompanyTagsMapping.tagId = CT.tagId
            where Companies.CompanyId=${companyId};
         `;
    
    try{
        companyTagData = await connection.query(getCompanyTagQuery);
    }catch(err){
        throw "getCompanyTagFail";
    }
    
    return companyTagData[0];
}

async function getSkills(connection,employmentId) {
    console.log("Query3 시작")
    let skills;
    const getSkillsQuery = `
            SELECT S.skillId,S.name from Employments
            LEFT JOIN EmploymentSkillMapping ESM on Employments.employmentId = ESM.employmentId
            LEFT JOIN Skills S on ESM.skillId = S.skillId
            WHERE Employments.employmentId=${employmentId};
         `;
    
    try{
        skills = await connection.query(getSkillsQuery);
    }catch(err){
        throw "getSkillsFail";
    }
    
    return skills[0];
}

async function getEmploymentImgs(connection,employmentId) {
    let ImgUrls;
    const getEmploymentImgsQuery = `
            SELECT EmploymentImgs.ImgUrl FROM EmploymentImgs
            WHERE employmentId=${employmentId};
         `;
    
    try{
        ImgUrls = await connection.query(getEmploymentImgsQuery);
    }catch(err){
        throw "getEmploymentImgsFail";
    }
    
    return ImgUrls[0];
}


async function getEmploymentsHavingHeart (connection,userId) {
    const  getEmploymentsHavingHeartQuery = `
        SELECT 
            Employments.employmentId,
            jobName,
            country,
            city,
            (recommendedSigningBonus+Employments.recommenderSigningBonus) AS 'SigningBonus',
            heartCount,
            C.companyName
        FROM Employments
        LEFT JOIN Companies C on Employments.companyId = C.CompanyId
        RIGHT JOIN  (
            select * from WANTED.Heart
            WHERE status='ACTIVE' AND userId=${userId}
            ORDER BY createdAt
        )IsHeart on IsHeart.employmentId=Employments.employmentId;
    `;

    const  employmentsRows = await connection.query(getEmploymentsHavingHeartQuery);

   console.log(employmentsRows[0]);
   
    return  employmentsRows[0];
}


async function getEmploymentsHavingBookMark (connection,userId) {
    const  getEmploymentsHavingBookMarkQuery = `
        SELECT 
            Employments.employmentId,
            jobName,
            country,
            city,
            (recommendedSigningBonus+Employments.recommenderSigningBonus) AS 'SigningBonus',
            bookMarkCount,
            C.companyName
        FROM Employments
        LEFT JOIN Companies C on Employments.companyId = C.CompanyId
        RIGHT JOIN  (
            select * from WANTED.BookMark
            WHERE status='ACTIVE' AND userId=${userId}
            ORDER BY createdAt
        )IsBookMark on IsBookMark.employmentId=Employments.employmentId;
    `;

    const  employmentsRows = await connection.query(getEmploymentsHavingBookMarkQuery);

   console.log(employmentsRows[0]);
   
    return  employmentsRows[0];
}

async function getEmploymentsUsingCompanyId(connection,userId,companyId){
    const  getEmploymentsUsingCompanyIdQuery = `
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
            LIMIT 0,9999; 
    `;
    // TODO employments 더미 더 넣어야함. MySQL 공식 문서에서 LIMIT옆에 엄청 큰 숫자 넣으래..진짜루..
    console.log("Query:");
    console.log(getEmploymentsUsingCompanyIdQuery);

    const  employmentRows = await connection.query(getEmploymentsUsingCompanyIdQuery);

    console.log("employmentRows: ");
    console.log(employmentRows[0]);

    return  employmentRows[0];
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
    getEmploymentDetails,
    getCompanyDetails,
    getCompanyTag,
    getSkills,
    getEmploymentImgs,
    getEmploymentsHavingHeart,
    getEmploymentsHavingBookMark,
    getEmploymentsUsingCompanyId,
    getRandomEmployments,
};
  


  