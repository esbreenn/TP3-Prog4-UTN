import { getToken, logout } from "../utils/auth";

const API_URL = "http://localhost:3000";

export function useApi() {
  async function request(path, method = "GET", body = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = getToken();
    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    const res = await fetch(API_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    // Si el token es inválido o expiro
    if (res.status === 401) {
      alert("Sesión expirada. Volvé a iniciar sesión.");
      logout();
      return;
    }

    return res.json();
  }

  return { request };
}
