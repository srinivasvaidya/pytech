Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicRouter = express_1.Router();
exports.publicRouter = publicRouter;
publicRouter.get("/simple", (request, response) => {
    response.json({
        text: "Hello Angular 2",
        title: "Greetings.",
    });
});
//# sourceMappingURL=C:/Users/pytechnovm/Desktop/PYPRIME/Deploy14thNov2017Working26Nov/Deploy14thNov2017Working26Nov/dist/server/routes/public.js.map