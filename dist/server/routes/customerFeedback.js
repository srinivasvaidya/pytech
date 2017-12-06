Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
var dbFactory = require("../db.factory");
var moment = require('moment');
var sql = require("mssql");
const feedBackRouter = express_1.Router();
exports.feedBackRouter = feedBackRouter;
feedBackRouter.post("/customerFeedbacksByMId", (request, response) => {
    let merchantBranchId = request.headers["merchantbranchid"];
    dbFactory.get()
        .then(function (conn) {
        // MerchantBranchId -> MerchantBranchId (MerchantBranch) ->  CitrineMerchantId (CitrineMerchantId)
        let query = `SELECT * from CustomerFeedbackResults where MerchantBranchId=${merchantBranchId}`;
        conn.request().query(query).
            then(function (result) {
            console.log(result);
            if (result.recordset.length > 0) {
                response.json({ message: "success", data: result.recordset });
            }
        });
    });
});
feedBackRouter.post("/getquestions", (request, response) => {
    dbFactory.get()
        .then(function (conn) {
        // MerchantBranchId -> MerchantBranchId (MerchantBranch) ->  CitrineMerchantId (CitrineMerchantId)
        let query = `SELECT * from CustomerFeedbackQuestions`;
        conn.request().query(query).
            then(function (result) {
            console.log(result);
            if (result.recordset.length > 0) {
                response.json({ message: "success", data: result.recordset });
            }
        });
    });
});
feedBackRouter.post("/getQuestionsByMerchantId", (request, response) => {
    let merchantBranchId = request.headers["merchantbranchid"];
    dbFactory.get()
        .then(function (conn) {
        // MerchantBranchId -> MerchantBranchId (MerchantBranch) ->  CitrineMerchantId (CitrineMerchantId)
        let query = `SELECT * from CustomerFeedbackQuestions where MerchantBranchId=${merchantBranchId}`;
        conn.request().query(query).
            then(function (result) {
            console.log(result);
            if (result.recordset.length > 0) {
                response.json({ message: "success", data: result.recordset });
            }
        });
    });
});
feedBackRouter.post("/getQuestionsByMerchantIdFId", (request, response) => {
    let model = request.body;
    dbFactory.get()
        .then(function (conn) {
        // MerchantBranchId -> MerchantBranchId (MerchantBranch) ->  CitrineMerchantId (CitrineMerchantId)
        let query = `SELECT * from CustomerFeedbackQuestions where MerchantBranchId=${model.merchantBranchId} And CustomerFeedbackId=${model.custFeedbackId}`;
        conn.request().query(query).
            then(function (result) {
            console.log(result);
            if (result.recordset.length > 0) {
                response.json({ message: "success", data: result.recordset });
            }
        });
    });
});
feedBackRouter.post("/deletequestion", (request, response) => {
    let model = request.body;
    dbFactory.get()
        .then(function (conn) {
        // MerchantBranchId -> MerchantBranchId (MerchantBranch) ->  CitrineMerchantId (CitrineMerchantId)
        let query = `Delete from CustomerFeedbackQuestions where QuestionNumber=${model.id}`;
        conn.request().query(query).
            then(function (result) {
            console.log(result);
            //if(result.recordset.length > 0){
            response.json({ message: "success", data: result });
            //}
        });
    });
});
feedBackRouter.post("/addquestions", (request, response) => {
    let merchantBranchId = request.headers["merchantbranchid"];
    let model = request.body;
    console.log("Model is ", model);
    AddFeedbackQuestion(model, merchantBranchId, (data) => {
        response.json(data);
    });
});
function AddFeedbackQuestion(model, merchantBranchId, cb) {
    dbFactory.get()
        .then(function (conn) {
        console.log("[add] Retrieved the connection");
        let insertQuery = `
            INSERT INTO [dbo].[CustomerFeedbackQuestions]
            ( [CustomerFeedbackId]
                ,[MerchantBranchId]
               ,[QuestionText]
                ,[QuestionWeight]
            )
            VALUES (@CustomerFeedbackId, @MerchantBranchId, @QuestionText,
            @QuestionWeight)
            `;
        var ps = new sql.PreparedStatement(conn);
        ps.input('MerchantBranchId', sql.Int);
        ps.input('CustomerFeedbackId', sql.Int);
        ps.input('QuestionText', sql.NVarChar);
        ps.input('QuestionWeight', sql.Decimal);
        ps.prepare(insertQuery, (err) => {
            if (!err) {
                ps.execute({
                    'MerchantBranchId': merchantBranchId,
                    'CustomerFeedbackId': model.customerFeedbackId,
                    'QuestionText': model.questionText,
                    'QuestionWeight': model.questionWeight
                }, (err, result) => {
                    ps.unprepare(err => {
                        if (err)
                            console.log("Error while unprepare ", err);
                    });
                    cb({
                        "status": "SUCCESS",
                        "message": err
                    });
                });
            }
            else {
                console.log(err);
                cb({
                    "status": "ERROR",
                    "message": err
                });
            }
        });
    }).catch(function (err) {
        console.log(err);
        cb({
            "error": "CP-001",
            "message": "Connection failed to save customer"
        });
    });
}
feedBackRouter.post("/addfeedback", (request, response) => {
    let model = request.body;
    console.log("Model is ", model);
    AddFeedback(model, (data) => {
        response.json(data);
    });
});
function AddFeedback(model, cb) {
    dbFactory.get()
        .then(function (conn) {
        console.log("[add] Retrieved the connection");
        let insertQuery = `
            INSERT INTO [dbo].[CustomerFeedbackResults]
            ( [MerchantBranchId]
                ,[StoreCustomerID]
                ,[CustomerInvoiceId]
                ,[PhoneNumber]
                ,[QuestionNum]
                ,[Feedback]
                ,[Rating]
                ,[CreatedDate]
            )
            VALUES (@MerchantBranchId, @StoreCustomerID, @CustomerInvoiceId, @PhoneNumber, @QuestionNum,
            @Feedback, @Rating, @CreatedDate)
            `;
        var ps = new sql.PreparedStatement(conn);
        ps.input('MerchantBranchId', sql.Int);
        ps.input('StoreCustomerID', sql.Int);
        ps.input('CustomerInvoiceId', sql.VarChar);
        ps.input('PhoneNumber', sql.VarChar);
        ps.input('QuestionNum', sql.Int);
        ps.input('Feedback', sql.VarChar);
        ps.input('Rating', sql.Int);
        ps.input('CreatedDate', sql.Date);
        ps.prepare(insertQuery, (err) => {
            if (!err) {
                ps.execute({
                    'MerchantBranchId': model.merchantBranchId,
                    'StoreCustomerID': model.storeCustomerId,
                    'CustomerInvoiceId': model.customerInvoiceId,
                    'PhoneNumber': model.phoneNumber,
                    'QuestionNum': model.questionNum,
                    'Feedback': model.feedback,
                    'Rating': model.rating,
                    'CreatedDate': new Date(),
                }, (err, result) => {
                    ps.unprepare(err => {
                        if (err)
                            console.log("Error while unprepare ", err);
                    });
                    cb({
                        "status": "SUCCESS",
                        "message": err
                    });
                });
            }
            else {
                console.log(err);
                cb({
                    "status": "ERROR",
                    "message": err
                });
            }
        });
    }).catch(function (err) {
        console.log(err);
        cb({
            "error": "CP-001",
            "message": "Connection failed to save customer"
        });
    });
}
feedBackRouter.post("/deletefeedback", (request, response) => {
    let model = request.body;
    dbFactory.get()
        .then(function (conn) {
        // MerchantBranchId -> MerchantBranchId (MerchantBranch) ->  CitrineMerchantId (CitrineMerchantId)
        let query = `Delete from CustomerFeedbackResults where CustomerFeedbackId=${model.id}`;
        conn.request().query(query).
            then(function (result) {
            console.log(result);
            //if(result.recordset.length > 0){
            response.json({ message: "success", data: result });
            //}
        });
    });
});
//# sourceMappingURL=C:/Users/pytechnovm/Desktop/PYPRIME/Deploy14thNov2017Working26Nov/Deploy14thNov2017Working26Nov/dist/server/routes/customerFeedback.js.map