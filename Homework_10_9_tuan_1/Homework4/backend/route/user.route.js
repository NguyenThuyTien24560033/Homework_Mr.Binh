import express from "express";
import { registerUser, loginUser } from "../service/user.service.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User authentication and profile endpoints
 * 
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         username:
 *           type: string
 *           example: "player1"
 *         email:
 *           type: string
 *           example: "player1@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         confirmPassword:
 *           type: string
 *           example: "password123"
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "player1@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error or invalid fields
 *       409:
 *         description: Email already exists
 */
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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in to existing account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 */
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

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info retrieved successfully
 *       401:
 *         description: Missing token
 *       403:
 *         description: Invalid or expired token
 */
userRouter.get("/me", authenticateToken, (req, res) => {
    return res.status(200).json({
        user: req.user,
    });
});

export default userRouter;