import { Router } from "express";
import {
  CreateBranch,
  DeleteBranch,
  GetBranches,
  UpdateBranch,
  GetAllBranches,
} from "./branch.controller";
import { IsAuthenticated, IsAuthorized } from "../../middlewares/session";

const branch = Router();

branch.route("/branches").get(IsAuthenticated, GetAllBranches);
branch
  .route("/branch")
  .get(IsAuthenticated, IsAuthorized, GetBranches)
  .post(IsAuthenticated, IsAuthorized, CreateBranch);
branch
  .route("/branch/:id")
  .put(IsAuthenticated, IsAuthorized, UpdateBranch)
  .delete(IsAuthenticated, IsAuthorized, DeleteBranch);

export default branch;
