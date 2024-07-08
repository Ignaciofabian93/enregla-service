import http from "http";
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { port, protocol } from "./config/environment";

import user from "./routes/user";

config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", user);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`${protocol}://localhost:${port}`);
});
