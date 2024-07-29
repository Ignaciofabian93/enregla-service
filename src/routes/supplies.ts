import { Router } from "express";
import {
  DeleteSupply,
  EditSupply,
  GetSupplies,
  GetSupply,
  SaveSupply,
} from "../controllers/supplies";
import { IsAuthenticated, IsAuthorized } from "../middlewares/session";

const supplies = Router();

supplies
  .route("/supplies")
  .get(IsAuthenticated, GetSupplies)
  .post(IsAuthenticated, IsAuthorized, SaveSupply);
supplies
  .route("/supplies/:id")
  .get(IsAuthenticated, GetSupply)
  .put(IsAuthenticated, IsAuthorized, EditSupply)
  .delete(IsAuthenticated, IsAuthorized, DeleteSupply);

export default supplies;
