module.exports = function(app) {
    const baseResponse = require("../../../config/baseResponseStatus");
    const {response, errResponse} = require("../../../config/response");

    const {emit} = require("nodemon");
    const multer = require("multer");

// multer-optional
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    });

    var upload = multer({storage: storage});

// Router
    app.post('/fileUpload/files', upload.single("fileName"),
        (req, res) => {
            console.log('제발제발 돼라')
            // if (err) {
            //     return res.json({success: false});
            // }
            return res.json({
                success: true,
                image: req.file.path,
                fileName: req.file.filename,
            });
        });


}
