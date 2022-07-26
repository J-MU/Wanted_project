const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {emit} = require("nodemon");
//const fileService = require(".");


exports.uploadFile = async function (req, res) {
    const img=req.file.path;
    console.log(req.file);

    if(img===undefined){
        return res.send(response(baseResponse.FILE_EMPTY));
    }

    //const uploadFileResponse = await fileService.uploadFile();

    return res.send(response(baseResponse.SUCCESS,img));
}