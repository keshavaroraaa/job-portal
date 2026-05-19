import { useContext, useState } from 'react';
import { Layout, Button, Menu, Dropdown, Space, Avatar, Typography, Switch } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  FundOutlined,
  SettingOutlined,
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';

const { Text } = Typography;

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenu = {
    items: [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: user?.role === 'employer' ? 'Dashboard' : 'My Dashboard',
        onClick: () => navigate('/dashboard'),
      },
      {
        key: 'profile',
        icon: <SettingOutlined />,
        label: 'Profile',
        onClick: () => navigate('/profile'),
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
        danger: true,
      },
    ],
  };

  const publicMenuItems = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/jobs', label: <Link to="/jobs">Browse Jobs</Link> },
  ];

  return (
    <Layout.Header
      style={{
        background: darkMode ? '#141414' : '#001529',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 64,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link
          to="/"
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FundOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          JobPortal
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={publicMenuItems}
          style={{
            background: 'transparent',
            borderBottom: 'none',
            flex: 1,
            minWidth: 200,
          }}
          theme="dark"
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={darkMode}
          onChange={toggleDarkMode}
        />
        {user ? (
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer', color: '#fff' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              <Text style={{ color: '#fff', maxWidth: 120 }} ellipsis>
                {user.name}
              </Text>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button type="text" style={{ color: '#fff' }} onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Space>
        )}
      </div>
    </Layout.Header>
  );
};

export default Navbar;
