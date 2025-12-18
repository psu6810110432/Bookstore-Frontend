import { useState, useEffect } from 'react';
import { Table, Button, Input, Form, Card, Space, Popconfirm, Divider, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/book-category");
      setCategories(response.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (values) => {
    try {
      await axios.post("/api/book-category", { name: values.name });
      form.resetFields();
      fetchCategories();
      message.success("Category added successfully");
    } catch (error) {
      message.error("Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/book-category/${id}`);
      fetchCategories();
      message.success("Category deleted");
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: 'Category Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Manage Categories</h2>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/books')}>
          Back to Books
        </Button>
      </div>

      <Card style={{ marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
        <Form form={form} layout="inline" onFinish={handleAddCategory}>
          <Form.Item 
            name="name" 
            label="New Category" 
            rules={[{ required: true, message: 'Please input category name' }]}
          >
            <Input placeholder="ชื่อหมวดหมู่..." style={{ width: 250 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add</Button>
          </Form.Item>
        </Form>
      </Card>

      <Table 
        dataSource={categories} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}