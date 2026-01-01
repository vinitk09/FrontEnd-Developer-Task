import axios from 'axios';

// Create an Axios instance with your backend URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this matches your server port
});

// Add a request interceptor
// This runs before every single request is sent
API.interceptors.request.use((req) => {
  // Check if there is a token in localStorage
  if (localStorage.getItem('token')) {
    // If yes, add it to the Authorization header
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;