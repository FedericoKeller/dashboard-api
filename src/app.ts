import express, { Request, Response, NextFunction } from "express";
import { connect } from "mongoose";

import DATABASE_CONNECTION from "./utils/database";

import { authRoutes } from "./routes/auth.router";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})

const connection = async () => {
  await connect(DATABASE_CONNECTION);
  app.listen(8080);
  console.log("Client connected");
};

connection();
