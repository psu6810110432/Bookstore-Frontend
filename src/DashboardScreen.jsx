import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin } from 'antd';
import { Column } from '@ant-design/plots';
import { BookOutlined, AppstoreOutlined, AlertOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ books: [], categories: [] });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookRes, catRes] = await Promise.all([
          axios.get("/api/book"),
          axios.get("/api/book-category")
        ]);
        setData({ books: bookRes.data, categories: catRes.data });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // เตรียมข้อมูลสำหรับกราฟ: นับจำนวนหนังสือตามหมวดหมู่
  const chartData = data.categories.map(cat => ({
    category: cat.name,
    count: data.books.filter(book => book.categoryId === cat.id).length
  }));

  const chartConfig = {
    data: chartData,
    xField: 'category',
    yField: 'count',
    label: { position: 'middle', style: { fill: '#FFFFFF', opacity: 0.6 } },
    meta: { category: { alias: 'หมวดหมู่' }, count: { alias: 'จำนวนหนังสือ' } },
  };

  const columns = [
    { title: 'ชื่อหนังสือ', dataIndex: 'title', key: 'title' },
    { title: 'ผู้แต่ง', dataIndex: 'author', key: 'author' },
    { title: 'คงเหลือ', dataIndex: 'stock', key: 'stock', 
      render: (stock) => (
        <span style={{ color: stock < 30 ? 'red' : 'inherit', fontWeight: stock < 30 ? 'bold' : 'normal' }}>
          {stock}
        </span>
      ) 
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {/* สถิติภาพรวม */}
          <Col span={8}>
            <Card>
              <Statistic title="หนังสือทั้งหมด" value={data.books.length} prefix={<BookOutlined />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="หมวดหมู่ทั้งหมด" value={data.categories.length} prefix={<AppstoreOutlined />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="สินค้าสต็อกต่ำ (< 30)" 
                value={data.books.filter(b => b.stock < 30).length} 
                valueStyle={{ color: '#cf1322' }}
                prefix={<AlertOutlined />} 
              />
            </Card>
          </Col>

          {/* กราฟแสดงจำนวนหนังสือตามหมวดหมู่ */}
          <Col span={12}>
            <Card title="จำนวนหนังสือแบ่งตามหมวดหมู่">
              <Column {...chartConfig} />
            </Card>
          </Col>

          {/* ตารางแสดงรายการหนังสือ (เน้นสต็อก) */}
          <Col span={12}>
            <Card title="รายการหนังสือและสต็อกคงเหลือ">
              <Table 
                dataSource={data.books} 
                columns={columns} 
                rowKey="id" 
                pagination={{ pageSize: 5 }} 
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}