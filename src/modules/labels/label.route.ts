import { Router } from "express";
import { GetAllLabels, GetLabels, SaveLabel } from "./label.controller";
import { IsAuthenticated, IsAuthorized } from "../../middlewares/session";

const label = Router();

label.route("/all-labels").get(IsAuthenticated, IsAuthorized, GetAllLabels);
label.route("/label").get(IsAuthenticated, GetLabels).post(IsAuthenticated, SaveLabel);

export default label;
