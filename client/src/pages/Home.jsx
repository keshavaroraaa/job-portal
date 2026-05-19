import { useContext } from 'react';
import { Row, Col, Typography, Button, Card, Statistic, Space, Input, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  SearchOutlined,
  TeamOutlined,
  FileTextOutlined,
  BuildOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(value.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, #001529 0%, #003a70 50%, #1677ff 100%)',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <Title level={1} style={{ color: '#fff', marginBottom: 16, fontSize: 42 }}>
          Find Your Dream Job Today
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, maxWidth: 600, margin: '0 auto 32px' }}>
          Connect with top employers and opportunities that match your skills and aspirations.
        </Paragraph>
        <Input.Search
          size="large"
          placeholder="Search jobs by title, skill, or keyword..."
          enterButton={<><SearchOutlined /> Search Jobs</>}
          onSearch={handleSearch}
          style={{ maxWidth: 600 }}
        />
        <div style={{ marginTop: 24 }}>
          <Space wrap>
            <Tag
              style={{ cursor: 'pointer', padding: '4px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
              onClick={() => navigate('/jobs?category=Engineering')}
            >
              Engineering
            </Tag>
            <Tag
              style={{ cursor: 'pointer', padding: '4px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
              onClick={() => navigate('/jobs?category=Design')}
            >
              Design
            </Tag>
            <Tag
              style={{ cursor: 'pointer', padding: '4px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
              onClick={() => navigate('/jobs?type=remote')}
            >
              Remote
            </Tag>
            <Tag
              style={{ cursor: 'pointer', padding: '4px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
              onClick={() => navigate('/jobs?type=internship')}
            >
              Internships
            </Tag>
          </Space>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <SearchOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4}>Browse Jobs</Title>
              <Text type="secondary">Search through thousands of job listings from top companies worldwide.</Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <ThunderboltOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4}>Quick Apply</Title>
              <Text type="secondary">Apply to positions with one click and track your applications.</Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
              <Title level={4}>Trusted Platform</Title>
              <Text type="secondary">Verified employers and secure application process.</Text>
            </Card>
          </Col>
        </Row>
      </div>

      <div style={{ background: '#f0f5ff', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>For Employers & Job Seekers</Title>
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} md={12}>
              <Card style={{ height: '100%' }}>
                <Space direction="vertical" size={16}>
                  <BuildOutlined style={{ fontSize: 40, color: '#1677ff' }} />
                  <Title level={3}>For Employers</Title>
                  <Text>
                    Post jobs, manage applications, and find the perfect candidates for your team.
                    Our platform makes recruitment seamless.
                  </Text>
                  <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
                    <li>Create detailed job postings</li>
                    <li>Review and manage applications</li>
                    <li>Track applicant status</li>
                    <li>Company profile management</li>
                  </ul>
                  <Button type="primary" size="large" onClick={() => navigate(user ? '/dashboard/create-job' : '/register')}>
                    {user ? 'Post a Job' : 'Get Started'} <ArrowRightOutlined />
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card style={{ height: '100%' }}>
                <Space direction="vertical" size={16}>
                  <TeamOutlined style={{ fontSize: 40, color: '#1677ff' }} />
                  <Title level={3}>For Job Seekers</Title>
                  <Text>
                    Discover opportunities that match your skills and career goals.
                    Your dream job is just a click away.
                  </Text>
                  <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
                    <li>Browse thousands of jobs</li>
                    <li>Apply with your profile</li>
                    <li>Track application status</li>
                    <li>Build professional profile</li>
                  </ul>
                  <Button type="primary" size="large" onClick={() => navigate('/jobs')}>
                    Browse Jobs <ArrowRightOutlined />
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <Row gutter={[48, 32]} justify="center">
          <Col xs={12} md={6}>
            <Statistic title="Active Jobs" value="10,000+" prefix={<FileTextOutlined />} />
          </Col>
          <Col xs={12} md={6}>
            <Statistic title="Companies" value="5,000+" prefix={<BuildOutlined />} />
          </Col>
          <Col xs={12} md={6}>
            <Statistic title="Job Seekers" value="50,000+" prefix={<TeamOutlined />} />
          </Col>
          <Col xs={12} md={6}>
            <Statistic title="Hired" value="15,000+" prefix={<GlobalOutlined />} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
