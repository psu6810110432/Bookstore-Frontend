import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, ConfigProvider } from 'antd';
import { DashboardOutlined, BookOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import DashboardScreen from './DashboardScreen';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';
import CategoryScreen from './CategoryScreen';

const { Header, Content } = Layout;

axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      axios.defaults.headers.common = { 'Authorization': `bearer ${savedToken}` };
      setIsAuthenticated(true);
      if (window.location.pathname === '/login' || window.location.pathname === '/') {
        navigate('/dashboard');
      }
    }
  }, []);

  const handleLoginSuccess = (token, rememberMe) => {
    setIsAuthenticated(true);
    if (rememberMe) {
      localStorage.setItem('token', token);
    }
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    navigate('/login');
  };

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/books', icon: <BookOutlined />, label: 'Books' },
    { key: '/categories', icon: <AppstoreOutlined />, label: 'Categories' },
  ];

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen onLoginSuccess={handleLoginSuccess} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: { headerBg: '#001529' },
          Menu: {
            darkItemSelectedBg: '#1890ff',
            darkItemBg: '#001529',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', marginRight: '40px', display: 'flex', alignItems: 'center' }}>
            <BookOutlined style={{ marginRight: '10px' }} /> Bookstore
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ flex: 1, minWidth: 0 }}
          />
          <Button 
            type="link" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout} 
            style={{ color: '#ff4d4f' }}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ background: '#f0f2f5' }}>
          <Routes>
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/books" element={<BookScreen />} />
            <Route path="/categories" element={<CategoryScreen />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;