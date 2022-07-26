const sensService = require("./sensService");

const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.send_message=async function (req, res) {
    if(!req.body)
        return res.send(errResponse(baseResponse.BODY_EMPTY));

    if(!req.body.phone)
        return res.send(errResponse(baseResponse.USER_PHONENUMBER_EMPTY));
    
    const phoneNumber=req.body.phone;
    
    if (!(/^01([0|1|6])([0-9]{3,4})([0-9]{4})$/.test(phoneNumber)))
        return res.send(errresponse(baseResponse.SIGNUP_PHONENUMBER_ERROR_TYPE));
    
    
    const suggestPhoneNumberResult=await sensService.send_message(phoneNumber);

    console.log("suggest:");
    console.log(suggestPhoneNumberResult);

    return res.send(suggestPhoneNumberResult);
}
