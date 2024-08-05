import { Router } from "express";
import {
  CreateBranch,
  DeleteBranch,
  GetBranch,
  GetBranches,
  UpdateBranch,
} from "./branch.controller";

const branch = Router();

branch.route("/branch").get(GetBranches).post(CreateBranch);
branch.route("/branch/:id").get(GetBranch).put(UpdateBranch).delete(DeleteBranch);

export default branch;
