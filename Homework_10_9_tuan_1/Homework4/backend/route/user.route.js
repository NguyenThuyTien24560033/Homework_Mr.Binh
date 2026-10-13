import express from "express";
import {registerUser, loginUser} from "../service/user.service.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    try {
        const user = await registerUser(
            req.body.username,
            req.body.password
        );

        return res.status(201).json({
            message: "Registration successful",
            user,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error("Register error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const user = await loginUser(
            req.body.username,
            req.body.password
        );

        return res.status(200).json({
            message: "Login successful",
            user,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
            });
        }

        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

export default userRouter;