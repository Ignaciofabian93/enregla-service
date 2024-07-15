import { Router } from "express";
import { DeleteSupply, EditSupply, GetSupplies, GetSupply, SaveSupply } from "../controllers/supplies";

const supplies = Router();

supplies.route("/supplies").get(GetSupplies).post(SaveSupply);
supplies.route("/supplies/:id").get(GetSupply).put(EditSupply).delete(DeleteSupply);

export default supplies;
