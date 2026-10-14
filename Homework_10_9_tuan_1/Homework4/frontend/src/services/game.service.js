import { API_URL } from "./api.js";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed.");
    }

    return data;
}

export function getGameInfo() {
    return request("/api/game");
}

export function getBoard() {
    return request("/api/board");
}

export function skipTurn() {
    return request("/api/skip-turn", {
        method: "POST",
    });
}

export function makeMove(index) {
    return request("/api/move", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ index }),
    });
}

export function createNewGame() {
    return request("/api/new-game", {
        method: "POST",
    });
}