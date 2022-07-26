const { application } = require('express');
var CryptoJS = require("crypto-js");
const request = require('request');
const baseResponse = require('../../../config/baseResponseStatus');
const {response, errResponse} = require("../../../config/response");

const sens=require("../SENS/sensController");

module.exports=function(app){
    app.post('/app/sms', sens.sendMessage);

    app.get('/app/users/:userId/code/:code/authentication',sens.authentication);
}
