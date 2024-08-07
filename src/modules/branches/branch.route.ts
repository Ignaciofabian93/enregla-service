import { Router } from "express";
import {
  CreateBranch,
  DeleteBranch,
  GetBranch,
  GetBranches,
  UpdateBranch,
  GetAllBranches,
} from "./branch.controller";

const branch = Router();

branch.route("/branches").get(GetAllBranches);
branch.route("/branch").get(GetBranches).post(CreateBranch);
branch.route("/branch/:id").get(GetBranch).put(UpdateBranch).delete(DeleteBranch);

export default branch;
