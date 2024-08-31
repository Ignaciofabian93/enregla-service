import { Router } from "express";
import {
  Auth,
  GetUsers,
  CreateUser,
  UpdateUser,
  DeleteUser,
  GetMe,
  GetAllUsers,
} from "./user.controller";
import { IsAuthenticated, IsAuthorized } from "../../middlewares/session";

const user = Router();

user.route("/auth").post(Auth);
user.route("/me").get(IsAuthenticated, GetMe);
user.route("/all-users").get(IsAuthenticated, GetAllUsers);
user
  .route("/user")
  .get(IsAuthenticated, IsAuthorized, GetUsers)
  .post(IsAuthenticated, IsAuthorized, CreateUser);
user
  .route("/user/:id")
  .put(IsAuthenticated, IsAuthorized, UpdateUser)
  .delete(IsAuthenticated, IsAuthorized, DeleteUser);

export default user;
