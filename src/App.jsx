import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import AddBook from './components/AddBook'; 
import EditBook from './components/EditBook'; 
import CategoryScreen from './CategoryScreen';

axios.defaults.baseURL = "http://localhost:3000"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      axios.defaults.headers.common = { 'Authorization': `bearer ${savedToken}` };
      setIsAuthenticated(true);
      if (window.location.pathname === '/login') {
        navigate('/books');
      }
    }
  }, []);

  const handleLoginSuccess = (token, rememberMe) => {
    setIsAuthenticated(true);
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
      {/* เพิ่ม Route สำหรับ Categories */}
      <Route 
        path="/categories" 
        element={isAuthenticated ? <CategoryScreen /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/add-book" 
        element={isAuthenticated ? <AddBook /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/edit-book/:id" 
        element={isAuthenticated ? <EditBook /> : <Navigate to="/login" />} 
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;