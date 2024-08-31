import { Router } from "express";
import { GetAllAgencies } from "./agency.controller";
import { IsAuthenticated } from "../../middlewares/session";

const agency = Router();

agency.route("/agency").get(IsAuthenticated, GetAllAgencies);

export default agency;
