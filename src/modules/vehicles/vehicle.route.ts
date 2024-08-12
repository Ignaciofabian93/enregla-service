import { Router } from "express";
import { DeleteVehicle, GetVehicles, SaveVehicle, UpdateVehicle } from "./vehicle.controller";

const vehicle = Router();

vehicle.route("/vehicle").get(GetVehicles).post(SaveVehicle);
vehicle.route("/vehicle/:id").put(UpdateVehicle).delete(DeleteVehicle);

export default vehicle;
