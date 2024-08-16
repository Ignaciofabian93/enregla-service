import { Router } from "express";
import {
  DeleteVehicle,
  GetVehicles,
  SaveVehicle,
  GetVehicleBrands,
  GetVehicleModels,
  UpdateVehicle,
} from "./vehicle.controller";

const vehicle = Router();

vehicle.route("/vehicle").get(GetVehicles).post(SaveVehicle);
vehicle.route("/vehicle/:id").put(UpdateVehicle).delete(DeleteVehicle);
vehicle.route("/vehicle/brand").get(GetVehicleBrands);
vehicle.route("/vehicle/model").get(GetVehicleModels);

export default vehicle;
