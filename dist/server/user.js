Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter = express_1.Router();
exports.userRouter = userRouter;
const user = {
    address: {
        city: "Gwenborough",
        geo: {
            lat: "-37.3159",
            lng: "81.1496",
        },
        street: "Kulas Light",
        suite: "Apt. 556",
        zipcode: "92998-3874",
    },
    company: {
        bs: "harness real-time e-markets",
        catchPhrase: "Multi-layered client-server neural-net",
        name: "Romaguera-Crona",
    },
    email: "Sincere@april.biz",
    id: 1,
    name: "Leanne Graham",
    phone: "1-770-736-8031 x56442",
    username: "Bret",
    website: "hildegard.org",
};
userRouter.get("/", (request, response) => {
    response.json(user);
});
//# sourceMappingURL=C:/Users/pytechnovm/Desktop/PYPRIME/Deploy14thNov2017Working26Nov/Deploy14thNov2017Working26Nov/dist/server/user.js.map