
module.exports = function(app) {
    const jwtMiddleware = require('../../../config/jwtMiddleWareIsNotLoginOk');
    const multer=require('multer');
    const file=require("./fileController");

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
        }
      })

    const upload=multer({
        storage: storage
    });

    //회사 검색 API
    try{
      app.post('/app/files', upload.single("Myfile") ,file.uploadFile);
    }catch(err){
      console.log("gogogoo");
      console.log("gogo");
      console.log(err);
    }
}