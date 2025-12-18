import { Button, Form, Select, Input, InputNumber, Card } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddBook() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/book-category").then(res => {
      setCategories(res.data.map(cat => ({ label: cat.name, value: cat.id })));
    });
  }, []);

  const handleAddBook = async (values) => {
    try {
      await axios.post("/api/book", values);
      navigate('/books');
    } catch (error) {
      console.error(error);
    }
  }

  return(
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
      <Card title="Add New Book" style={{ width: 500 }}>
        <Form layout="vertical" onFinish={handleAddBook}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input/>
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input/>
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <Select options={categories}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Save Book</Button>
            <Button type="link" onClick={() => navigate('/books')} block>Cancel</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}