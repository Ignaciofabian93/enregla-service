import { Router } from "express";
import { CreateAgency, DeleteAgency, GetAgencies, GetAgency, UpdateAgency } from "../controllers/agency";

const agency = Router();

agency.route("/agency").get(GetAgencies).post(CreateAgency);
agency.route("/agency/:id").get(GetAgency).put(UpdateAgency).delete(DeleteAgency);

export default agency;
