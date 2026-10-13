export interface AuthUser {
  userId?: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: string;
  roleId?: number | string;
  createdAt?: string;
}

const AUTH_STORAGE_KEY = "trustlens_user";

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to persist user in storage", e);
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear user from storage", e);
  }
}

export function isAuthenticated(): boolean {
  const user = getStoredUser();
  return Boolean(user && user.username);
}
