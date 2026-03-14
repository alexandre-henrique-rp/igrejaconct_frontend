// Script para debug de autenticação no frontend
// Execute isso no console do navegador (F12)

console.log('=== DEBUG AUTH ===');

// Verificar tokens no localStorage
const accessToken = localStorage.getItem('access_token');
const refreshToken = localStorage.getItem('refresh_token');
const user = localStorage.getItem('user');

console.log('Access Token:', accessToken ? 'Presente (' + accessToken.substring(0, 20) + '...)' : 'NÃO ENCONTRADO');
console.log('Refresh Token:', refreshToken ? 'Presente (' + refreshToken.substring(0, 20) + '...)' : 'NÃO ENCONTRADO');
console.log('User:', user ? JSON.parse(user) : 'NÃO ENCONTRADO');

// Verificar se o token está expirado
if (accessToken) {
  try {
    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    const expTime = decoded.exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expTime - now;
    
    console.log('Token expira em:', new Date(expTime).toLocaleString());
    console.log('Tempo até expirar:', Math.floor(timeUntilExpiry / 1000), 'segundos');
    console.log('Token expirado?', timeUntilExpiry <= 0);
  } catch (e) {
    console.log('Erro ao decodificar token:', e);
  }
}

console.log('==================');
