import { useState } from 'react';
// เพิ่มการ import Checkbox จาก antd
import { Button, Form, Input, Alert, Checkbox } from 'antd';
import axios from 'axios'

const URL_AUTH = "/api/auth/login"

export default function LoginScreen(props) {
  
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true)
      setErrMsg(null)
      // formData จะมีค่า username, password และ remember (จาก Checkbox) [cite: 318, 430]
      const response = await axios.post(URL_AUTH, {
        username: formData.username,
        password: formData.password
      });
      
      const token = response.data.access_token; 
      
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` } 
      
      // ส่งค่า formData.remember กลับไปที่ App.jsx เพื่อตัดสินใจว่าจะเซฟลง localStorage หรือไม่ [cite: 491]
      props.onLoginSuccess(token, formData.remember);
    } catch(err) { 
      console.log(err)
      setErrMsg(err.message)
    } finally { setIsLoading(false) }
  }

  return(
    <Form
      onFinish={handleLogin}
      autoComplete="off"
      layout="vertical" // เพิ่มเพื่อให้จัดวาง label และ input ได้สวยงามขึ้น
      style={{ maxWidth: 400, margin: 'auto', padding: '2em' }} // ตกแต่งเล็กน้อย
    >
      {errMsg &&
        <Form.Item>
          <Alert message={errMsg} type="error" />
        </Form.Item>
      }

      <Form.Item
        label="Username"
        name="username"
        rules={[{required: true, message: 'Please input your username!'}]}>
        <Input />
      </Form.Item>
      
      <Form.Item
        label="Password"
        name="password"
        rules={[{required: true, message: 'Please input your password!'}]}>
        <Input.Password />
      </Form.Item>

      {/* เพิ่ม UI Remember Me ตรงนี้ */}
      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember Me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button 
           type="primary" 
           htmlType="submit" 
           loading={isLoading}
           block // ปรับให้ปุ่มกว้างเต็มพื้นที่
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}