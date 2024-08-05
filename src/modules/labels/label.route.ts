import { Router } from "express";
import { GetLabel, GetLabels, SaveLabel } from "./label.controller";

const label = Router();

label.route("/label").get(GetLabels).post(SaveLabel);
label.route("/label/:id").get(GetLabel);

export default label;
