import { Router } from "express";
import {
  CreateSupply,
  DeleteSupply,
  GetSupplies,
  GetSupplyList,
  UpdateSupply,
} from "./supply.controller";
import { IsAuthenticated, IsAuthorized } from "../../middlewares/session";

const supply = Router();

supply.route("/supply-list").get(IsAuthenticated, GetSupplyList);
supply
  .route("/supply")
  .get(IsAuthenticated, IsAuthorized, GetSupplies)
  .post(IsAuthenticated, IsAuthorized, CreateSupply);
supply
  .route("/supply/:id")
  .put(IsAuthenticated, IsAuthorized, UpdateSupply)
  .delete(IsAuthenticated, IsAuthorized, DeleteSupply);

export default supply;
