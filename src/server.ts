import https from "https";
import http from "http";
import fs from "fs";
import express from "express";
import cors from "cors";
import path from "path";
import user from "./modules/users/user.route";
import vehicle from "./modules/vehicles/vehicle.route";
import label from "./modules/labels/label.route";
import branch from "./modules/branches/branch.route";
import supply from "./modules/supplies/supply.route";
import agency from "./modules/agencies/agency.route";

import { config } from "dotenv";
config();

const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", user);
app.use("/api", vehicle);
app.use("/api", label);
app.use("/api", supply);
app.use("/api", branch);
app.use("/api", agency);

// const options = {
//   key: fs.readFileSync(path.resolve("/etc/ssl/private/privkey.pem")),
//   cert: fs.readFileSync(path.resolve("/etc/ssl/certs/fullchain.pem")),
// };

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
