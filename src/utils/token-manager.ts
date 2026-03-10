const TOKEN_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  USER: 'user',
};

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const tokenManager = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEYS.ACCESS),
  getRefreshToken: () => localStorage.getItem(TOKEN_KEYS.REFRESH),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEYS.ACCESS, access);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refresh);
  },
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    localStorage.removeItem(TOKEN_KEYS.USER);
  },
  getUser: () => {
    const user = localStorage.getItem(TOKEN_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: any) => {
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
  },
  
  decodeToken: (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  },

  isTokenExpiredOrExpiringSoon: (token: string) => {
    const decoded = tokenManager.decodeToken(token);
    if (!decoded?.exp) return true;

    const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
    const expTime = decoded.exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expTime - now;

    return timeUntilExpiry <= REFRESH_THRESHOLD_MS;
  },
};
