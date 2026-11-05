import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import router from "./route/game.route.js";
import { connectDB } from "./config/db.js";
import userRouter from "./route/user.route.js";
import { initGameSocket } from "./socket/game.socket.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use("/api", userRouter);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

initGameSocket(io);

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running with Socket.io on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error.message);
    });