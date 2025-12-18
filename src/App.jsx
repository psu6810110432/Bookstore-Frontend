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
  

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // หลังจาก login สำเร็จ ให้เปลี่ยนหน้าไปที่รายการหนังสือ
    navigate('/books'); 
  };

  return (
    <Routes>
      {/* หน้า Login */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginScreen onLoginSuccess={handleLoginSuccess}/> : <Navigate to="/books" />} 
      />

      {/* หน้า BookScreen (Protected Route พื้นฐาน) */}
      <Route 
        path="/books" 
        element={isAuthenticated ? <BookScreen /> : <Navigate to="/login" />} 
      />

      {/* Redirect ไปยังหน้า login หากเข้า path อื่นๆ */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;