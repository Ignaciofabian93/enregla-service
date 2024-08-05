import { Router } from "express";
import {
  CreateSupply,
  DeleteSupply,
  GetSupplies,
  GetSupply,
  UpdateSupply,
} from "./supply.controller";

const supply = Router();

supply.route("/supply").get(GetSupplies).post(CreateSupply);
supply.route("/supply/:id").get(GetSupply).put(UpdateSupply).delete(DeleteSupply);

export default supply;
