import bcrypt from "bcryptjs";
import User from "../model/user.model.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

export async function registerUser(username, password) {
    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !password
    ) {
        throw createError("Username and password are required", 400);
    }

    username = username.trim();

    if (username.length < 3 || username.length > 20) {
        throw createError("Username must be 3-20 characters long", 400);
    }

    if (password.length < 8) {
        throw createError("Password must be at least 8 characters long", 400);
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        throw createError("Username already exists", 409);
    }


    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            username,
            passwordHash,
        });

        return {
            id: user._id,
            username: user.username,
            createdAt: user.createdAt,
        };
    } catch (error) {
        if (error.code === 11000) {
            throw createError("Username already exists", 409);
        }

        throw error;
    }
}

export async function loginUser(username, password) {
    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !password
    ) {
        throw createError("Username and password are required", 400);
    }

    const user = await User.findOne({
        username: username.trim(),
    });

    if (!user) {
        throw createError("Invalid username or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        throw createError("Invalid username or password", 401);
    }

    return {
        id: user._id,
        username: user.username,
    };
}