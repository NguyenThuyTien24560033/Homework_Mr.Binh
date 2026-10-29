import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser({ username, email, password, confirmPassword }) {
    if (!username || !email || !password || !confirmPassword) {
        throw createError("All fields (username, email, password, confirmPassword) are required", 400);
    }

    if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof confirmPassword !== "string"
    ) {
        throw createError("Invalid input data types", 400);
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 3 || cleanUsername.length > 20) {
        throw createError("Username must be 3-20 characters long", 400);
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
        throw createError("Invalid email address format", 400);
    }

    if (password.length < 8) {
        throw createError("Password must be at least 8 characters long", 400);
    }

    if (password !== confirmPassword) {
        throw createError("Passwords do not match", 400);
    }

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
        throw createError("Email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            username: cleanUsername,
            email: cleanEmail,
            passwordHash,
        });

        return {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };
    } catch (error) {
        if (error.code === 11000) {
            throw createError("Email already exists", 409);
        }
        throw error;
    }
}

export async function loginUser({ email, password }) {
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        throw createError("Email and password are required", 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
        throw createError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        throw createError("Invalid email or password", 401);
    }

    const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET || "default_jwt_secret",
        { expiresIn: "2d" }
    );

    return {
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
        token,
    };
}