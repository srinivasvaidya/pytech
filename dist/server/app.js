Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const compression = require("compression");
const express = require("express");
const path = require("path");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("./config");
const login_1 = require("./routes/login");
const dashboard_1 = require("./routes/dashboard");
const customers_1 = require("./routes/customers");
const campaigns_1 = require("./routes/campaigns");
const transactions_1 = require("./routes/transactions");
const campaigns_rule_1 = require("./routes/campaigns.rule");
const customerFeedback_1 = require("./routes/customerFeedback");
const node_xlsx_1 = require("node-xlsx");
const sms_1 = require("./routes/sms");
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
var cors = require('cors');
var app = express();
exports.app = app;
function IsAuthenticated(req, res, next) {
    var headers = req.headers, isDummy = false;
    if (isDummy)
        return next();
    console.log("Request url is " + req.url + " " + req.url.indexOf("/api/v1/login"));
    if (req.url.indexOf("/api/v1/login") >= 0) {
        return next();
    }
    console.log(headers);
    if ("token" in headers && headers["token"]) {
        console.log("about to verify the token");
        jsonwebtoken_1.verify(headers["token"], config_1.secret, function (err, decode) {
            console.log(err);
            if (err) {
                res.statusCode = 401;
                return next(new Error("Unauthorized exception"));
            }
            return next();
        });
        console.log("is it verified...");
        //return next();
    }
    else {
        res.statusCode = 401;
        return next(new Error("401"));
    }
}
app.disable("x-powered-by");
app.use(cors());
app.options('*', cors());
app.use(body_parser_1.json());
//app.use(busboy());
app.use(compression());
app.use(body_parser_1.urlencoded({ extended: true }));
app.all("/api/*", IsAuthenticated);
// api routes
app.use("/login", login_1.loginRouter);
app.use("/api/v1/login", login_1.loginRouter);
app.use("/api/v1/dashboard", dashboard_1.dashboardRouter);
app.use("/customers", customers_1.customersRouter);
app.use("/feedback", customerFeedback_1.feedBackRouter);
app.use("/api/v1/sms", sms_1.smsRouter);
app.use("/campaignsReport", campaigns_1.campaignsRouter);
app.use("/transactions", transactions_1.transactionsRouter);
app.use("/campaigns", campaigns_rule_1.campaignsRuleRouter);
app.use("/campaignreport", campaigns_1.campaignsRouter);
app.use("/upload", upload.single('file'), (req, res) => {
    let merchantBranchId = req.headers["merchantbranchid"];
    /** When using the "single"
        data come in "req.file" regardless of the attribute "name". **/
    var tmp_path = req.file.path;
    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    //var target_path = 'uploads/' + req.file.originalname;
    console.log("Uploaded path is ", tmp_path);
    var workSheetsFromFile = node_xlsx_1.default.parse(`${tmp_path}`);
    console.log("Worksheet is ", workSheetsFromFile);
    let promises = [];
    for (let sheet in workSheetsFromFile) {
        let data = workSheetsFromFile[sheet]["data"];
        for (let i = 1; i < data.length; i++) {
            let model = {
                'MerchantId': merchantBranchId,
                'source': 'Upload',
                'customerType': data[i][0],
                'firstName': data[i][2],
                'lastName': data[i][3],
                'companyName': data[i][4],
                'companyWebsite': '',
                'primaryPhone': data[i][5],
                'secondaryPhone': data[i][6],
                'email': data[i][1],
                'address1': data[i][7],
                'address2': data[i][8],
                'country': data[i][11],
                'state': data[i][10],
                'city': data[i][9],
                'zipCode': data[i][12],
                'birthMonth': data[i][13],
                'birthDay': data[i][14],
                'annivMonth': data[i][15],
                'annivDay': data[i][16],
                'createdDate': new Date(),
                'createdBy': ''
            };
            promises.push(promisifyAddCustomer(model, merchantBranchId));
        }
    }
    Promise.all(promises)
        .then(function (data) {
        res.json({
            "status": "Success"
        });
    })
        .catch(function (err) {
        res.json({
            "status": "ERROR",
            "message": err
        });
    });
});
function promisifyAddCustomer(model, merchantBranchId) {
    return new Promise(function (resolve, reject) {
        customers_1.AddCustomer(model, merchantBranchId, (data) => {
            return resolve(data);
        });
    });
}
//if (app.get("env") === "production") {
// in production mode run application from dist folder
console.log("CUrrent directory ", __dirname);
app.use("/", express.static(path.join(__dirname, "/../")));
//}
// var app = express()
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error("Not Found " + req.originalUrl);
    next(err);
});
// production error handler
// no stacktrace leaked to user
app.use((err, req, res, next) => {
    console.log("Response is ", err);
    res.status(res.statusCode || 500);
    res.json({
        error: {},
        message: err.message,
    });
});
//# sourceMappingURL=C:/Users/pytechnovm/Desktop/PYPRIME/Deploy14thNov2017Working26Nov/Deploy14thNov2017Working26Nov/dist/server/app.js.map