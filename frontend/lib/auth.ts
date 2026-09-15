export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
}

export function clearAccessToken() {
  localStorage.removeItem("accessToken");
}