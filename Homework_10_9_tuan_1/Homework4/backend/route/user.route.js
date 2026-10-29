import express from "express";
import { registerUser, loginUser } from "../service/user.service.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        const user = await registerUser({
            username,
            email,
            password,
            confirmPassword,
        });

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
        const { email, password } = req.body;

        const result = await loginUser({
            email,
            password,
        });

        return res.status(200).json({
            message: "Login successful",
            user: result.user,
            token: result.token,
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

userRouter.get("/me", authenticateToken, (req, res) => {
    return res.status(200).json({
        user: req.user,
    });
});

export default userRouter;