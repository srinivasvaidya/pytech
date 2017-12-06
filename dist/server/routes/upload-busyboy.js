Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadRouter = express_1.Router();
exports.uploadRouter = uploadRouter;
uploadRouter.post("/", (req, res) => {
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log('on:file');
    });
    req.busboy.on('field', function (fieldname, value, valTruncated, keyTruncated) {
        console.log('on:field');
    });
    req.busboy.once('end', function () {
        console.log('once:end');
        res.send('done');
    });
    req.pipe(req.busboy);
});
//# sourceMappingURL=C:/Users/pytechnovm/Desktop/PYPRIME/Deploy14thNov2017Working26Nov/Deploy14thNov2017Working26Nov/dist/server/routes/upload-busyboy.js.map