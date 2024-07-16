import { Router } from "express";
import { CreateBranch, DeleteBranch, EditBranch, GetBranch, GetBranches } from "../controllers/branch";

const branch = Router();

branch.route("/branch").get(GetBranches).post(CreateBranch);
branch.route("/branch/:id").get(GetBranch).put(EditBranch).delete(DeleteBranch);

export default branch;
