import { Form, Select, Input, InputNumber, Button, Card, Spin } from "antd"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [catRes, bookRes] = await Promise.all([
          axios.get("/api/book-category"),
          axios.get(`/api/book/${id}`)
        ]);
        setCategories(catRes.data.map(cat => ({ label: cat.name, value: cat.id })));
        form.setFieldsValue(bookRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id, form]);

  const handleSave = async (values) => {
    try {
      const { category, createdAt, updatedAt, ...data } = values;
      await axios.patch(`/api/book/${id}`, {
        ...data,
        price: Number(values.price),
        stock: Number(values.stock)
      });
      navigate('/books');
    } catch (error) {
      console.error(error);
    }
  };

  return(
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
      <Spin spinning={loading}>
        <Card title="Edit Book" style={{ width: 500 }}>
          <Form form={form} layout="vertical" onFinish={handleSave}>
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
              <Button type="primary" htmlType="submit" block>Update Book</Button>
              <Button type="link" onClick={() => navigate('/books')} block>Cancel</Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  )
}