import { Router } from "express";

const user = Router();

user.route("/auth").get();
user.route("/user").get().post();
user.route("/user/:id").get().put().delete();

export default user;
