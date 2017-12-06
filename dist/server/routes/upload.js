Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadRouter = express_1.Router();
exports.uploadRouter = uploadRouter;
uploadRouter.post("/", (req, res) => {
    /** When using the "single"
        data come in "req.file" regardless of the attribute "name". **/
    var tmp_path = req.file.path;
    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    var target_path = 'uploads/' + req.file.originalname;
    /** A better way to copy the uploaded file. **/
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function () { res.render('complete'); });
    src.on('error', function (err) { res.render('error'); });
});
//# sourceMappingURL=C:/Users/pytechnovm/Desktop/PYPRIME/Deploy14thNov2017Working26Nov/Deploy14thNov2017Working26Nov/dist/server/routes/upload.js.map