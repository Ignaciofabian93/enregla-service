import { Router } from "express";
import {
  GetBrands,
  GetModels,
  GetVehicles,
  SaveVehicle,
  UpdateVehicle,
} from "./vehicle.controller";

const vehicle = Router();

vehicle.route("/vehicle").get(GetVehicles).post(SaveVehicle).put(UpdateVehicle);
vehicle.route("/vehicle/brand").get(GetBrands);
vehicle.route("/vehicle/model").get(GetModels);

export default vehicle;
