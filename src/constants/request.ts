import { Request } from "express";
import { User } from "../modules/users/user.types";

export type CustomRequest = Request & {
  user?: User;
};
