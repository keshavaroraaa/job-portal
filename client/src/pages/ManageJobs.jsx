import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Popconfirm, message, Spin, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getMyJobs, deleteJob } from '../api/jobs';
import dayjs from 'dayjs';

const { Title } = Typography;

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const navigate = useNavigate();

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await getMyJobs({ page, limit: 10 });
      setJobs(data.data);
      setPagination(data.pagination);
    } catch {
      message.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      message.success('Job deleted successfully');
      fetchJobs();
    } catch {
      message.error('Failed to delete job');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <Link to={`/jobs/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (v) => v || '-',
    },
    {
      title: 'Type',
      dataIndex: 'jobType',
      key: 'jobType',
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => (
        <Tag color={s === 'open' ? 'green' : 'red'}>{s?.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Applicants',
      dataIndex: 'applications',
      key: 'applications',
      render: (apps) => (
        <Link to={`/dashboard/applicants?jobId=${apps?.[0]?.jobId || ''}`}>
          <Button type="link" icon={<TeamOutlined />}>
            {apps?.length || 0}
          </Button>
        </Link>
      ),
    },
    {
      title: 'Posted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d) => dayjs(d).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/dashboard/applicants?jobId=${record.id}`)}
          >
            Applicants
          </Button>
          <Popconfirm
            title="Delete this job?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Manage Jobs</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/dashboard/create-job')}>
          Post New Job
        </Button>
      </div>
      <Card>
        <Table
          dataSource={jobs}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            total: pagination.total,
            pageSize: pagination.limit,
            onChange: fetchJobs,
            showSizeChanger: false,
          }}
          locale={{ emptyText: <Empty description="No jobs posted yet" /> }}
        />
      </Card>
    </div>
  );
};

export default ManageJobs;
