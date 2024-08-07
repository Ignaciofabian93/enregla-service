import { Router } from "express";
import {
  CreateBrand,
  CreateModel,
  DeleteBrand,
  DeleteModel,
  GetBrand,
  GetBrands,
  GetModel,
  GetModels,
  UpdateBrand,
  UpdateModel,
} from "./vehicle.controller";

const vehicle = Router();

vehicle.route("/vehicle/brand").get(GetBrands).post(CreateBrand);
vehicle.route("/vehicle/brand/:id").get(GetBrand).put(UpdateBrand).delete(DeleteBrand);
vehicle.route("/vehicle/model").get(GetModels).post(CreateModel);
vehicle.route("/vehicle/model/:id").get(GetModel).put(UpdateModel).delete(DeleteModel);

export default vehicle;
