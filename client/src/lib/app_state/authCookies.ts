const TOKEN_COOKIE = "access_token";

export function setAuthToken(token: string) {
  const parts = [
    `${TOKEN_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "SameSite=Lax",
  ];

  if (window.location.protocol === "https:") {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

export function getAuthToken(): string | null {
  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${TOKEN_COOKIE}=`));
  if (!match) {
    return null;
  }

  const value = match.slice(`${TOKEN_COOKIE}=`.length);
  return value ? decodeURIComponent(value) : null;
}

export function clearAuthToken() {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
