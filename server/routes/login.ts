import { pbkdf2, randomBytes } from "crypto";
import { NextFunction, Request, Response, Router } from "express";
import { sign, verify } from "jsonwebtoken";
import { digest, length, secret } from "../config";
import { Permissions } from "../permissions";

var dbFactory = require("../db.factory");

const loginRouter: Router = Router();

// login method
loginRouter.post("/", (request: Request, response: Response, next: NextFunction) => {
    let userName = request.body.userName;
    let password = request.body.password;
    dbFactory.get()
        // Successfull connection
        .then(function (conn) {
            // MerchantBranchId -> MerchantBranchId (MerchantBranch) ->  CitrineMerchantId (CitrineMerchantId)
            let loginQuery = `SELECT CU.MerchantBranchId, CU.UserName, CU.FirstName, CU.LastName, CU.CitrineRoleId, CU.CitrineUserId, CU.UserPassword, MB.CITRINEMERCHANTID FROM CitrineUser CU INNER JOIN MerchantBranch MB ON CU.MERCHANTBRANCHID=MB.MERCHANTBRANCHID WHERE CU.UserName='${userName}'`;
            conn.request().query(loginQuery).
            then(function(result){
                //console.log(result.recordset);
                if(result.recordset.length > 0){
                    if(result.recordset[0].UserPassword == password){
                        let user = result.recordset[0];
                        conn.request().query(`select * from MerchantBranch where CitrineMerchantId='${user.CITRINEMERCHANTID}'`).
                        then(function(subresult){
                            const token = sign(Object.assign({}, { user: userName, permissions: [] }), secret, { expiresIn: "5m" });
                            var permissions = Permissions.default;
                            if(Permissions[result.recordset[0].CitrineUserId]){
                                permissions = Permissions[result.recordset[0].CitrineUserId];
                            } 
                            response.json({
                                jwt: token, 
                                role: "admin",
                                user: user, 
                                branches: subresult.recordset,
                                permissions: permissions,
                                merchantBranchId: user.MerchantBranchId});
                        }).catch(function(err){
                            response.json({message: "ERROR:Unexpected error"});
                        });
                    } else {
                        response.json({message: "Wrong password"});
                    }
                } else {
                    response.json({message: "Wrong password"});
                }
            }).catch(function(err){
                console.log("Error ", err, loginQuery);
            });
        }).catch(function(err){
            console.log(err);
            response.json({
                "error" : "CP-002",
                "message" : "ERROR: Unable to login due to DB connection failure"
            });              
        });
});

export { loginRouter };
