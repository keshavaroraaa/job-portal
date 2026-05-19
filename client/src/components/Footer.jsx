import { Layout, Typography, Space } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const Footer = () => {
  return (
    <Layout.Footer
      style={{
        textAlign: 'center',
        background: '#001529',
        padding: '24px 50px',
      }}
    >
      <Space direction="vertical" size={8}>
        <Space size={16}>
          <Link to="/" style={{ color: '#fff' }}>Home</Link>
          <Link to="/jobs" style={{ color: '#fff' }}>Browse Jobs</Link>
          <Link to="/login" style={{ color: '#fff' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Register</Link>
        </Space>
        <Space size={16}>
          <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </Text>
        </Space>
      </Space>
    </Layout.Footer>
  );
};

export default Footer;
