import { Router } from "express";
import {
  DeleteVehicle,
  GetVehicles,
  SaveVehicle,
  GetVehicleBrands,
  GetVehicleModels,
  UpdateVehicle,
} from "./vehicle.controller";
import { IsAuthenticated, IsAuthorized } from "../../middlewares/session";

const vehicle = Router();

vehicle
  .route("/vehicle")
  .get(IsAuthenticated, IsAuthorized, GetVehicles)
  .post(IsAuthenticated, IsAuthorized, SaveVehicle);
vehicle
  .route("/vehicle/:id")
  .put(IsAuthenticated, IsAuthorized, UpdateVehicle)
  .delete(IsAuthenticated, IsAuthorized, DeleteVehicle);
vehicle.route("/vehicle/brand").get(IsAuthenticated, GetVehicleBrands);
vehicle.route("/vehicle/model").get(IsAuthenticated, GetVehicleModels);

export default vehicle;
