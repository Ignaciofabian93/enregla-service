import { Router } from "express";
import { GetAllLabels, GetLabel, GetLabels, SaveLabel } from "./label.controller";
import { IsAuthenticated } from "../../middlewares/session";

const label = Router();

label.route("/all-labels").get(IsAuthenticated, GetAllLabels);
label.route("/label").get(GetLabels).post(SaveLabel);
label.route("/label/:id").get(GetLabel);

export default label;
