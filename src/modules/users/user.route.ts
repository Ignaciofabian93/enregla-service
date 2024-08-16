import { Router } from "express";
import {
  Auth,
  GetUser,
  GetUsers,
  CreateUser,
  UpdateUser,
  DeleteUser,
  GetMe,
} from "./user.controller";
import { IsAuthenticated, IsAuthorized } from "../../middlewares/session";

const user = Router();

user.route("/auth").post(Auth);
user.route("/me").get(IsAuthenticated, GetMe);
user.route("/user").get(IsAuthenticated, IsAuthorized, GetUsers).post(CreateUser);
user
  .route("/user/:id")
  .get(IsAuthenticated, IsAuthorized, GetUser)
  .put(IsAuthenticated, IsAuthorized, UpdateUser)
  .delete(IsAuthenticated, IsAuthorized, DeleteUser);

export default user;
