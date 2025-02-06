import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { pool } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import cors from "cors";
import fileUpload from "express-fileupload";

dotenv.config({ path: "./config.env" });
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', ['https://artist-management-livid.vercel.app']],
  credentials: true,
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  // allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan("dev"));

app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true
}));


app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is running" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/songs", songRoutes);


// Check database connection and start the server
pool.query('SELECT 1').then(() => {
  console.log('Database connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
}).catch(err => {
  console.log(err);
});

