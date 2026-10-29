import { API_URL } from "./api.js";

const TOKEN_KEY = "caro_access_token";

export function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Xóa token khi đăng xuất
export function logoutUser() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function registerUser({ username, email, password, confirmPassword }) {
    const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            email,
            password,
            confirmPassword,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login fail");
    }

    return data;
}

export async function loginUser({ email, password }) {
    const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login fail");
    }

    if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
    }

    return data;
}

export async function getCurrentUser() {
    const token = getStoredToken();
    if (!token) return null;

    const response = await fetch(`${API_URL}/api/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        logoutUser();
        return null;
    }

    const data = await response.json();
    return data.user;
}