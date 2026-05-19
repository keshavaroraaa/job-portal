import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Typography, message, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getMyApplications } from '../api/applications';
import dayjs from 'dayjs';

const { Title } = Typography;

const statusColors = {
  pending: 'orange',
  reviewed: 'blue',
  shortlisted: 'purple',
  rejected: 'red',
  accepted: 'green',
};

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });

  const fetchApplications = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getMyApplications({ page, limit: 10 });
      setApplications(data.data);
      setPagination(data.pagination);
    } catch {
      message.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'job',
      key: 'title',
      render: (job) => job ? <Link to={`/jobs/${job.id}`}>{job.title}</Link> : 'N/A',
    },
    {
      title: 'Company',
      dataIndex: 'job',
      key: 'company',
      render: (job) => job?.employer?.employerProfile?.companyName || job?.employer?.name || 'N/A',
    },
    {
      title: 'Location',
      dataIndex: 'job',
      key: 'location',
      render: (job) => job?.location || 'N/A',
    },
    {
      title: 'Applied On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d) => dayjs(d).format('MMM D, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{s?.toUpperCase()}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Link to={`/jobs/${record.job?.id}`}>
          <Button type="link" icon={<EyeOutlined />}>View Job</Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>My Applications</Title>
      <Card>
        <Table
          dataSource={applications}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            total: pagination.total,
            pageSize: pagination.limit,
            onChange: fetchApplications,
            showSizeChanger: false,
          }}
          locale={{ emptyText: <Empty description="No applications yet. <a href='/jobs'>Browse jobs</a>" /> }}
        />
      </Card>
    </div>
  );
};

export default AppliedJobs;
