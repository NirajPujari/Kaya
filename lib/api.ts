const BASE_URL = "/api";
const TOKEN_KEY = "jwt_token";

export function fetchRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY);

  return fetch(`${BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}
