import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography, List, Tag, Empty } from 'antd';
import {
  FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, StarOutlined, EyeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/profile';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const SeekerDashboard = () => {
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

  return (
    <div>
      <Title level={4}>My Dashboard</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card hoverable>
            <Statistic title="Total Applications" value={data?.totalApplications || 0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card hoverable>
            <Statistic title="Pending" value={data?.pendingApplications || 0} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card hoverable>
            <Statistic title="Reviewed" value={data?.reviewedApplications || 0} prefix={<EyeOutlined />} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card hoverable>
            <Statistic title="Shortlisted" value={data?.shortlistedApplications || 0} prefix={<StarOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Applications" extra={<Link to="/dashboard/applied-jobs">View All</Link>}>
        {data?.recentApplications?.length > 0 ? (
          <List
            dataSource={data.recentApplications}
            renderItem={(app) => (
              <List.Item
                actions={[
                  <Link to={`/jobs/${app.job?.id}`}>View Job</Link>,
                ]}
              >
                <List.Item.Meta
                  title={app.job?.title || 'Unknown Job'}
                  description={
                    <div>
                      <Text>{app.job?.employer?.employerProfile?.companyName || app.job?.employer?.name}</Text>
                      <Tag color={
                        app.status === 'pending' ? 'orange' :
                        app.status === 'reviewed' ? 'blue' :
                        app.status === 'shortlisted' ? 'purple' :
                        app.status === 'accepted' ? 'green' : 'red'
                      } style={{ marginLeft: 8 }}>
                        {app.status?.toUpperCase()}
                      </Tag>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No applications yet. <a href='/jobs'>Browse jobs</a>" />
        )}
      </Card>
    </div>
  );
};

export default SeekerDashboard;
