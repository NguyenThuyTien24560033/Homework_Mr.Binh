import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./route/game.route.js";
import {connectDB} from "./config/db.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", router);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error.message);
    });