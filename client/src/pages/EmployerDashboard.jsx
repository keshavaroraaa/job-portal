import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, List, Tag, Typography, Space, Table } from 'antd';
import {
  FileTextOutlined, TeamOutlined, CheckCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/profile';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const EmployerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await getDashboard();
        setData(res.data);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  const recentColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title', render: (text, record) => <Link to={`/jobs/${record.id}`}>{text}</Link> },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (v) => v || 'N/A' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'open' ? 'green' : 'red'}>{s}</Tag> },
    { title: 'Applications', dataIndex: 'applications', key: 'apps', render: (apps) => apps?.length || 0 },
    { title: 'Posted', dataIndex: 'createdAt', key: 'createdAt', render: (d) => dayjs(d).format('MMM D, YYYY') },
  ];

  return (
    <div>
      <Title level={4}>Employer Dashboard</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card hoverable>
            <Statistic title="Total Jobs" value={data?.totalJobs || 0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card hoverable>
            <Statistic title="Open Jobs" value={data?.openJobs || 0} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card hoverable>
            <Statistic title="Total Applications" value={data?.totalApplications || 0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card hoverable>
            <Statistic title="Pending Reviews" value={data?.pendingApplications || 0} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Job Postings" extra={<Link to="/dashboard/manage-jobs">View All</Link>}>
        <Table
          dataSource={data?.recentJobs || []}
          columns={recentColumns}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'No jobs posted yet. <a href="/dashboard/create-job">Post your first job</a>' }}
        />
      </Card>
    </div>
  );
};

export default EmployerDashboard;
