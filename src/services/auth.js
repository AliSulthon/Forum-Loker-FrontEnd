import api from './api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    
    
    const responseData = response.data;
    const authData = responseData.data; // Masuk ke object 'data' dulu

    if (authData && authData.access_token) {
      // Simpan token dengan key 'access_token' yang benar
      localStorage.setItem('token', authData.access_token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    } else {
      throw new Error("Token tidak ditemukan dalam respons server");
    }

    return responseData;
  } catch (error) {
    console.error("Login Error:", error);
    throw error.response ? error.response.data : error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  window.location.reload();
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};