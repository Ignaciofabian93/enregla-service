import { Router } from "express";
import { CreateVehicle, DeleteVehicle, GetVehicles, UpdateVehicle } from "./vehicle.controller";

const vehicle = Router();

vehicle.route("vehicle/:service").get(GetVehicles).post(CreateVehicle);
vehicle.route("vehicle/:service/:id").put(UpdateVehicle).delete(DeleteVehicle);

export default vehicle;
