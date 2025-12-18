import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';

axios.defaults.baseURL = "http://localhost:3000"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // ตรวจสอบ Token เมื่อ Refresh หน้าจอ (Bonus: Remember Me)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      // นำ Token กลับมาใส่ใน Header ของ Axios
      axios.defaults.headers.common = { 'Authorization': `bearer ${savedToken}` };
      setIsAuthenticated(true);
      // ถ้าอยู่ที่หน้า login ให้เด้งไปหน้า books ทันที
      if (window.location.pathname === '/login') {
        navigate('/books');
      }
    }
  }, []);

  const handleLoginSuccess = (token, rememberMe) => {
    setIsAuthenticated(true);
    // เก็บ Token ลง localStorage หากผู้ใช้เลือก Remember Me
    if (rememberMe) {
      localStorage.setItem('token', token);
    }
    navigate('/books');
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginScreen onLoginSuccess={handleLoginSuccess}/> : <Navigate to="/books" />} 
      />
      <Route 
        path="/books" 
        element={isAuthenticated ? <BookScreen /> : <Navigate to="/login" />} 
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;