var CryptoJS = require("crypto-js");
const request = require('request');
const {pool} = require("../../../config/database");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const sensRoute = require("./sensRoute");
const sensDao=require("./sensDao");



exports.send_message=async function(phoneNumber,userId,code) {
    let responseObject={};

    var user_phone_number = phoneNumber;//수신 전화번호 기입
    var resultCode = 200;
    const date = Date.now().toString();
    const uri = "ncp:sms:kr:289767670251:chanllenge_assignment";    //process.env.SERVICE_ID; //서비스 ID
    const secretKey = "Y8ptyApuIBGtHQhPUyOHKQzouuOZxy8w20Fz8Q4w";           //process.env.NCP_SECRET_KEY;// Secret Key
    const accessKey = "XwscgRJSZeQh1BrKuIiH"; //process.env.NCP_KEY;//Access Key
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;
    

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    request
    (
        {
            method: method,
            json: true,
            uri: url,
            headers: {
            "Contenc-type": "application/json; charset=utf-8",
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-timestamp": date,
            "x-ncp-apigw-signature-v2": signature,
            },
            body: {
            type: "SMS",
            countryCode: "82",
            from: "01085050877",//"발신번호기입"
            content: "Uks company에서 알립니다 위 문자를 보신 고객께서는 uk에게 연락주세요"+code,//문자내용 기입,
            messages: [
                { to: `${user_phone_number}`, },],
            }, 
        },
        function (err, res, html) {
            if (err) console.log(err);
            else { 
                setHistory(userId,code);
                resultCode = 200; 
                console.log(html); 
            }
          }
    );
     
    return  resultCode;
  }
  
setHistory=async function(userId,code){
    const connection = await pool.getConnection(async (conn) => conn);
    
    console.log("code:")
    console.log(code);

    // const currentTimeObject=new Date();
    // console.log(currentTimeObject);
    // const currentTimeISO=currentTimeObject.toISOString();
    
    

    const curr = new Date();
    console.log("현재시간(Locale) : " + curr + '<br>');   // 현재시간(Locale) : Tue May 31 2022 09:00:30

    const d=new Date();
    const time=d.toFormat("YYYY-MM-DD HH24:MI:SS");
    
    const result=sensDao.setHistory(connection,userId,code,time);

    connection.release();
    return result;
}