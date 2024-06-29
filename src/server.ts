import http from "http";
import express from "express";
import cors from "cors";
import { config } from "dotenv";

import user from "./routes/user";

config();

const port = process.env.PORT || 4000;

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
  console.log(`http://localhost:${port}`);
});
