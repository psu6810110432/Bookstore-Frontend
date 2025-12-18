import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin, Button, Space } from 'antd'; // เพิ่ม Space ตรงนี้
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import BookList from './components/BookList'

const URL_BOOK = "/api/book"

function BookScreen() {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_BOOK);
      setBookData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleLikeBook = async (book) => {
    setLoading(true)
    try {
      await axios.patch(URL_BOOK + `/${book.id}`, { likeCount: book.likeCount + 1 });
      fetchBooks();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteBook = async (bookId) => {
    setLoading(true)
    try {
      await axios.delete(URL_BOOK + `/${bookId}`);
      fetchBooks();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Book Store</h1>
        <Space>
          <Button onClick={() => navigate('/categories')}>Manage Categories</Button>
          <Button type="primary" onClick={() => navigate('/add-book')}>Add New Book</Button>
        </Space>
      </div>
      <Divider>My Books List</Divider>
      <Spin spinning={loading}>
        <BookList 
          data={bookData} 
          onLiked={handleLikeBook} 
          onDeleted={handleDeleteBook}
          onEdit={(book) => navigate(`/edit-book/${book.id}`)}
        />
      </Spin>
    </div>
  );
}

export default BookScreen;