const sensService = require("./sensService");
const sensProvider=require("./sensProvider");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.sendMessage=async function (req, res) {

    if(!req.params)
        
    if(!req.body)
        return res.send(errResponse(baseResponse.BODY_EMPTY));

    if(!req.body.phone)
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_EMPTY));
    
    if(!req.body.userId)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY));    

    const phoneNumber=req.body.phone;
    const userId=req.body.userId;
    const code=Math.floor(Math.random() * (9999 - 1000) + 1000);
    if (!(/^01([0|1|6])([0-9]{3,4})([0-9]{4})$/.test(phoneNumber)))
        return res.send(errresponse(baseResponse.SIGNUP_PHONENUMBER_ERROR_TYPE));
    
    
    const suggestPhoneNumberResult=await sensService.send_message(phoneNumber,userId,code);

    console.log("suggest:");
    console.log(suggestPhoneNumberResult);

    return res.send(suggestPhoneNumberResult);
}

exports.authentication=async function (req, res) {
    const userId=req.params.userId;
    const code=req.params.code;

    const result=await sensProvider.authentication(userId,code);

    return res.send(result);
}