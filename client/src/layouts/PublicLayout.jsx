import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const { Content } = Layout;

const PublicLayout = ({ darkMode, toggleDarkMode }) => {
  return (
    <Layout style={{ minHeight: '100vh', background: darkMode ? '#141414' : '#f5f5f5' }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default PublicLayout;
