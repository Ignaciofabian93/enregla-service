import { Router } from "express";
import {
  CreateSupply,
  DeleteSupply,
  GetSupplies,
  GetSupply,
  GetSupplyList,
  UpdateSupply,
} from "./supply.controller";

const supply = Router();

supply.route("/supply-list").get(GetSupplyList);
supply.route("/supply").get(GetSupplies).post(CreateSupply);
supply.route("/supply/:id").get(GetSupply).put(UpdateSupply).delete(DeleteSupply);

export default supply;
