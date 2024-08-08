import { Router } from "express";
import { GetAllAgencies } from "./agency.controller";

const agency = Router();

agency.route("/agency").get(GetAllAgencies);

export default agency;
