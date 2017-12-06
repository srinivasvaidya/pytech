import { json, urlencoded } from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as path from "path";
import { sign, verify } from "jsonwebtoken";
import { digest, length, secret } from "./config";
import { loginRouter } from "./routes/login";
import { dashboardRouter } from "./routes/dashboard";
import { customersRouter, AddCustomer } from './routes/customers';
import { campaignsRouter } from './routes/campaigns';
import { transactionsRouter} from './routes/transactions';
import { campaignsRuleRouter } from './routes/campaigns.rule';
import { feedBackRouter } from "./routes/customerFeedback";
import xlsx from 'node-xlsx';
import { smsRouter } from "./routes/sms";
var multer  = require('multer')
var upload = multer({ dest: './uploads/' })

var cors = require('cors');

var app: express.Application = express();


function IsAuthenticated(req,res,next){
    var headers = req.headers, isDummy = false;
    if(isDummy)
      return next();
    console.log("Request url is " + req.url + " " + req.url.indexOf("/api/v1/login"));
    if(req.url.indexOf("/api/v1/login") >= 0 ){
      return next();
    }
    console.log(headers);
    if("token" in headers && headers["token"]){
        console.log("about to verify the token");
        verify(headers["token"], secret, function(err, decode){
            console.log(err);
            if(err){
              res.statusCode = 401;
              return next(new Error("Unauthorized exception"));      
            }
            return next();
        });
        console.log("is it verified...");
        //return next();
    } else {
        res.statusCode = 401;
        return next(new Error("401"));
    }
}


app.disable("x-powered-by");
app.use(cors());
app.options('*', cors());
app.use(json());
//app.use(busboy());
app.use(compression());
app.use(urlencoded({ extended: true }));

app.all("/api/*", IsAuthenticated);

// api routes
app.use("/login", loginRouter);
app.use("/api/v1/login", loginRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/customers", customersRouter);
app.use("/feedback", feedBackRouter);
app.use("/api/v1/sms", smsRouter);
app.use("/campaignsReport", campaignsRouter);
app.use("/transactions", transactionsRouter);
app.use("/campaigns", campaignsRuleRouter);
app.use("/campaignreport", campaignsRouter);
app.use("/upload", upload.single('file'), (req, res) => {
  let merchantBranchId = req.headers["merchantbranchid"]
  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  //var target_path = 'uploads/' + req.file.originalname;
  console.log("Uploaded path is ", tmp_path);
  var workSheetsFromFile = xlsx.parse(`${tmp_path}`);
  console.log("Worksheet is ", workSheetsFromFile);
  let promises = []
  for(let sheet in workSheetsFromFile){
    let data = workSheetsFromFile[sheet]["data"]

    for(let i=1;i<data.length;i++){
      let model = {
          'MerchantId' : merchantBranchId,
          'source' :  'Upload',
          'customerType' : data[i][0],
          'firstName' :  data[i][2],
          'lastName' :  data[i][3],
          'companyName' :  data[i][4],
          'companyWebsite' :  '',
          'primaryPhone' : data[i][5],
          'secondaryPhone' : data[i][6],
          'email' :  data[i][1],
          'address1' :  data[i][7],
          'address2' :  data[i][8],
          'country' :  data[i][11],
          'state' :  data[i][10],
          'city' :  data[i][9],
          'zipCode' :  data[i][12],
          'birthMonth' :  data[i][13],
          'birthDay' :  data[i][14],
          'annivMonth' :  data[i][15],
          'annivDay' :  data[i][16],
          'createdDate' :  new Date(),
          'createdBy' :  ''
        }
        promises.push(promisifyAddCustomer(model, merchantBranchId));
    }
  }
  Promise.all(promises)    
    .then(function(data){ // do stuff when success
      res.json({
        "status" : "Success"
      })
    })
    .catch(function(err){ // error handling
      res.json({
        "status" : "ERROR",
        "message" : err 
      })
    });
});

function promisifyAddCustomer(model, merchantBranchId){
  return new Promise(function(resolve, reject){
    AddCustomer(model, merchantBranchId,(data)=>{
      return resolve(data);
    });
  });
}

//if (app.get("env") === "production") {
  // in production mode run application from dist folder
console.log("CUrrent directory ", __dirname)
app.use("/", express.static(path.join(__dirname, "/../")));
//}
// var app = express()
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});


// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next) => {
  var err = new Error("Not Found " + req.originalUrl);
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("Response is ", err);
  res.status(res.statusCode || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

export { app };
