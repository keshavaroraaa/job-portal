import { useContext, useState } from 'react';
import { Card, Form, Input, Button, Typography, Divider, Select, Alert } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, BankOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Title, Text } = Typography;

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('job_seeker');

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      await register(values);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px - 70px)',
        padding: '40px 24px',
        background: 'linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 100%)',
      }}
    >
      <Card style={{ width: 480, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Create Account</Title>
          <Text type="secondary">Join JobPortal today</Text>
        </div>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish} initialValues={{ role: 'job_seeker' }}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your full name" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Create a password" size="large" />
          </Form.Item>

          <Form.Item
            name="role"
            label="I want to"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select size="large" onChange={setRole}>
              <Select.Option value="job_seeker">Find a Job</Select.Option>
              <Select.Option value="employer">Hire Talent</Select.Option>
            </Select>
          </Form.Item>

          {role === 'employer' && (
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, message: 'Please enter your company name' }]}
            >
              <Input prefix={<BankOutlined />} placeholder="Enter your company name" size="large" />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text>
            Already have an account? <Link to="/login">Sign in</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;
