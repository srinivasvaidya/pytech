Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid = require("uuid");
const feedRouter = express_1.Router();
exports.feedRouter = feedRouter;
feedRouter.post("/", (request, response) => {
    response.json({
        id: uuid.v4(),
        name: request.body.name,
        text: request.body.text,
    });
});
feedRouter.post("/:id/comment", (request, response) => {
    const feedID = request.params.id;
    response.json({
        comment: {
            id: uuid.v4(),
            text: request.body.text,
        },
        id: feedID,
    });
});
feedRouter.delete("/:id", (request, response) => {
    response.json({
        id: request.params.id,
    });
});
//# sourceMappingURL=C:/Users/pytechnovm/Desktop/PYPRIME/Deploy14thNov2017Working26Nov/Deploy14thNov2017Working26Nov/dist/server/routes/feed.js.map