import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./config/db";
import logger from "./helpers/logging";
import authRoute from "./routes/authRoute";
import productRoute from "./routes/productRoute";
import workRoute from "./routes/workRoute";
import cartRoute from "./routes/cartRoute";

const app = express();
const PORT = process.env.PORT || 8000;
dotenv.config();
// Middleware setup
connectDB();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/work", workRoute);
app.use("/api/v1/cart", cartRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // logger.info(`Server running on port ${PORT}`)
});
