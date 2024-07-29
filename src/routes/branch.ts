import { Router } from "express";
import {
  CreateBranch,
  DeleteBranch,
  EditBranch,
  GetBranch,
  GetBranches,
} from "../controllers/branch";
import { IsAuthenticated, IsAuthorized } from "../middlewares/session";

const branch = Router();

branch
  .route("/branch")
  .get(IsAuthenticated, GetBranches)
  .post(IsAuthenticated, IsAuthorized, CreateBranch);
branch
  .route("/branch/:id")
  .get(IsAuthenticated, GetBranch)
  .put(IsAuthenticated, IsAuthorized, EditBranch)
  .delete(IsAuthenticated, IsAuthorized, DeleteBranch);

export default branch;
