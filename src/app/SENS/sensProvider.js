const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {pool} = require("../../../config/database");
require('date-utils');
const sensDao=require("./sensDao");


exports.authentication = async function (userId,code) {
    const connection = await pool.getConnection(async (conn) => conn);
    console.log("authentication");
    // const curr = new Date();
    // console.log("현재시간(Locale) : " + curr + '<br>');   // 현재시간(Locale) : Tue May 31 2022 09:00:30
    // 2. UTC 시간 계산
    // const utc = 
    //   curr.getTime() + 
    //   (curr.getTimezoneOffset() * 60 * 1000);
    // console.log(new Date(utc));
    // // 3. UTC to KST (UTC + 9시간)
    // const KR_TIME_DIFF = 9 * 60 * 60 * 1000;  //한국 시간(KST)은 UTC시간보다 9시간 더 빠르므로 9시간을 밀리초 단위로 변환.
    // const kr_curr = new Date(utc + (KR_TIME_DIFF));  //UTC 시간을 한국 시간으로 변환하기 위해 utc 밀리초 값에 9시간을 더함.
    // console.log(kr_curr);
    // const currentTime=kr_curr.toISOString();
    // console.log("한국시간 : " + currentTime);

    // const currentDate=curr.substring(0,10);
    // const time=curr.substring(11,19);
    // const currentTimeString=currentDate+" "+time;
    // console.log("ISO 시간: ",currentTimeString);
    const d=new Date();
    const time=d.toFormat("YYYY-MM-DD HH24:MI:SS");
    //const currentTime=await sensDao.getCurrentTime(connection);
    //console.log(currentTime);
    const isHave=await sensDao.getAuthenticationResult(connection,userId,code,time);

    console.log(isHave);
    if(isHave.length>0)
    {
        console.log("have!@!");
        return response(baseResponse.SUCCESS);
    }else{
        console.log("don't have!!@!");
        return response(baseResponse.FAILED_ERROR);
    }

};
  