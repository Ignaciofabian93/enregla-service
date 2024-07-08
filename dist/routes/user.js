"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const session_1 = require("../middlewares/session");
const user = (0, express_1.Router)();
user.route("/auth").post(user_1.Auth);
user.route("/user").get(session_1.IsAuthenticated, user_1.GetUsers).post(user_1.CreateUser);
user
    .route("/user/:id")
    .get(session_1.IsAuthenticated, user_1.GetUser)
    .put(session_1.IsAuthenticated, user_1.UpdateUser)
    .delete(session_1.IsAuthenticated, user_1.DeleteUser);
exports.default = user;
