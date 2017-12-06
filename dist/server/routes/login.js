Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const permissions_1 = require("../permissions");
var dbFactory = require("../db.factory");
const loginRouter = express_1.Router();
exports.loginRouter = loginRouter;
// login method
loginRouter.post("/", (request, response, next) => {
    let userName = request.body.userName;
    let password = request.body.password;
    dbFactory.get()
        .then(function (conn) {
        // MerchantBranchId -> MerchantBranchId (MerchantBranch) ->  CitrineMerchantId (CitrineMerchantId)
        let loginQuery = `SELECT CU.MerchantBranchId, CU.UserName, CU.FirstName, CU.LastName, CU.CitrineRoleId, CU.CitrineUserId, CU.UserPassword, MB.CITRINEMERCHANTID FROM CitrineUser CU INNER JOIN MerchantBranch MB ON CU.MERCHANTBRANCHID=MB.MERCHANTBRANCHID WHERE CU.UserName='${userName}'`;
        conn.request().query(loginQuery).
            then(function (result) {
            //console.log(result.recordset);
            if (result.recordset.length > 0) {
                if (result.recordset[0].UserPassword == password) {
                    let user = result.recordset[0];
                    conn.request().query(`select * from MerchantBranch where CitrineMerchantId='${user.CITRINEMERCHANTID}'`).
                        then(function (subresult) {
                        const token = jsonwebtoken_1.sign(Object.assign({}, { user: userName, permissions: [] }), config_1.secret, { expiresIn: "5m" });
                        var permissions = permissions_1.Permissions.default;
                        if (permissions_1.Permissions[result.recordset[0].CitrineUserId]) {
                            permissions = permissions_1.Permissions[result.recordset[0].CitrineUserId];
                        }
                        response.json({
                            jwt: token,
                            role: "admin",
                            user: user,
                            branches: subresult.recordset,
                            permissions: permissions,
                            merchantBranchId: user.MerchantBranchId
                        });
                    }).catch(function (err) {
                        response.json({ message: "ERROR:Unexpected error" });
                    });
                }
                else {
                    response.json({ message: "Wrong password" });
                }
            }
            else {
                response.json({ message: "Wrong password" });
            }
        }).catch(function (err) {
            console.log("Error ", err, loginQuery);
        });
    }).catch(function (err) {
        console.log(err);
        response.json({
            "error": "CP-002",
            "message": "ERROR: Unable to login due to DB connection failure"
        });
    });
});
//# sourceMappingURL=C:/Users/pytechnovm/Desktop/PYPRIME/Deploy14thNov2017Working26Nov/Deploy14thNov2017Working26Nov/dist/server/routes/login.js.map