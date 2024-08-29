import { Router } from "express";
import { GetAllLabels, GetLabel, GetLabels, SaveLabel } from "./label.controller";
import { IsAuthenticated } from "../../middlewares/session";

const label = Router();

label.route("/all-labels").get(IsAuthenticated, GetAllLabels);
label.route("/label").get(IsAuthenticated, GetLabels).post(IsAuthenticated, SaveLabel);
label.route("/label/:id").get(IsAuthenticated, GetLabel);

export default label;
