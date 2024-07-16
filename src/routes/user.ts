import { Router } from "express";
import { Auth, GetUser, GetUsers, CreateUser, UpdateUser, DeleteUser } from "../controllers/user";
import { IsAuthenticated } from "../middlewares/session";

const user = Router();

user.route("/auth").post(Auth);
user.route("/user").get(GetUsers).post(CreateUser);
user
  .route("/user/:id")
  .get(IsAuthenticated, GetUser)
  .put(IsAuthenticated, UpdateUser)
  .delete(IsAuthenticated, DeleteUser);

export default user;
