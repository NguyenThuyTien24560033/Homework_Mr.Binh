import { API_URL } from "./api.js";

export async function registerUser(username, password) {
  const response = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
        username, 
        password 
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đăng ký thất bại");
  }

  return data;
}

export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
        username, 
        password 
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }

  return data;
}