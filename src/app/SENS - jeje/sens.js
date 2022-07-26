module.exports = function(app) {
    const CryptoJS = require('../../../node_modules/crypto-js');
    const request = require('request');

    app.get('/sms/:phone', (req, res) => {
        console.log('hello');
        const paramObj = req.params;
        send_message(paramObj.phone);
        res.send("complete!");
    });


    function send_message(phone) {

        var user_phone_number = phone;//수신 전화번호 기입
        var resultCode = 404;
        const date = Date.now().toString();
        const uri = "ncp:sms:kr:289823050795:wanted_service" ; //서비스 ID
        const secretKey = "mR7JYOZD16EIsxqzPVSijk78Lq7WVDGtmWREUxSo";// Secret Key
        const accessKey = "JblS1jjFGUA3OBHtfzdy";  //Access Key
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
        request({
                method: method,
                json: true,
                uri: url,
                headers: {
                    "Contenc-type": "application/json; charset=utf-8",
                    "x-ncp-iam-access-key": accessKey,
                    "x-ncp-apigw-timestamp": date,
                    "x-ncp-apigw-signature-v2": signature
                },
                body: {
                    type: "SMS",
                    countryCode: "82",
                    from: "01082039157",//"발신번호기입",
                    content: "Hi I'm Jeje",//문자내용 기입,
                    messages: [
                        {to: `${user_phone_number}`,},]
                },
            },
            function (err, res, html) {
                if (err) console.log(err);
                else {
                    resultCode = 200;
                    console.log(html);
                }
            }
        );
        return resultCode;
    }


}