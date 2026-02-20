require("dotenv").config();
import { app } from "./app";
import http from "http";
import mongoose from "mongoose";
import { initSocketServer } from "./socketServer";
import "./utils/slaCron";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// Initialize socket BEFORE listen
initSocketServer(server);

mongoose
  .connect(process.env.DB_URL || "")
  .then(() => {
    console.log("MongoDB connected");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
