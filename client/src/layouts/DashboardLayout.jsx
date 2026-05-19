import { useContext, useState } from 'react';
import { Layout, Menu, Avatar, Typography, Button, Switch, Dropdown, Space, theme } from 'antd';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  DashboardOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  FundOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const DashboardLayout = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const employerMenuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/dashboard/create-job', icon: <FileAddOutlined />, label: 'Post a Job' },
    { key: '/dashboard/manage-jobs', icon: <UnorderedListOutlined />, label: 'Manage Jobs' },
    { key: '/dashboard/applicants', icon: <TeamOutlined />, label: 'Applicants' },
    { key: '/profile', icon: <SettingOutlined />, label: 'Profile' },
  ];

  const seekerMenuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/jobs', icon: <FundOutlined />, label: 'Browse Jobs' },
    { key: '/dashboard/applied-jobs', icon: <CheckCircleOutlined />, label: 'Applied Jobs' },
    { key: '/profile', icon: <SettingOutlined />, label: 'Profile' },
  ];

  const menuItems = user?.role === 'employer' ? employerMenuItems : seekerMenuItems;

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Profile', onClick: () => navigate('/profile') },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout, danger: true },
    ],
  };

  const siderStyle = {
    background: darkMode ? '#1f1f1f' : '#001529',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        style={siderStyle}
        trigger={null}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Link to="/" style={{ color: '#fff', fontSize: collapsed ? 16 : 20, fontWeight: 700, textDecoration: 'none' }}>
            {collapsed ? <FundOutlined /> : 'JobPortal'}
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: darkMode ? '#141414' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </Space>
          <Space size={16}>
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
                <Text style={{ maxWidth: 120 }} ellipsis>{user?.name}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: 24, minHeight: 'calc(100vh - 112px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
