import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Select, Typography, Space, message, Descriptions, Modal, Empty } from 'antd';
import { useSearchParams, Link } from 'react-router-dom';
import { getJobApplications, updateApplicationStatus, getAllEmployerApplications } from '../api/applications';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const statusColors = {
  pending: 'orange',
  reviewed: 'blue',
  shortlisted: 'purple',
  rejected: 'red',
  accepted: 'green',
};

const Applicants = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const fetchApplications = async (page = 1) => {
    setLoading(true);
    try {
      let result;
      if (jobId) {
        result = await getJobApplications(jobId, { page, limit: 10 });
      } else {
        result = await getAllEmployerApplications({ page, limit: 10 });
      }
      const data = result.data;
      setApplications(data.data);
      setPagination(data.pagination);
    } catch {
      message.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, { status });
      message.success('Status updated');
      fetchApplications();
    } catch {
      message.error('Failed to update status');
    }
  };

  const showDetail = (app) => {
    setSelectedApp(app);
    setDetailVisible(true);
  };

  const columns = [
    {
      title: 'Applicant',
      dataIndex: 'seeker',
      key: 'name',
      render: (seeker) => seeker?.name || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'seeker',
      key: 'email',
      render: (seeker) => seeker?.email || 'N/A',
    },
    {
      title: 'Job',
      dataIndex: 'job',
      key: 'jobTitle',
      render: (job) => job ? <Link to={`/jobs/${job.id}`}>{job.title}</Link> : 'N/A',
    },
    {
      title: 'Applied',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d) => dayjs(d).format('MMM D, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ width: 130 }}
          onChange={(val) => handleStatusChange(record.id, val)}
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'Reviewed', value: 'reviewed' },
            { label: 'Shortlisted', value: 'shortlisted' },
            { label: 'Rejected', value: 'rejected' },
            { label: 'Accepted', value: 'accepted' },
          ]}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => showDetail(record)}>View Profile</Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>{jobId ? 'Job Applicants' : 'All Applications'}</Title>
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
          locale={{ emptyText: <Empty description="No applications yet" /> }}
        />
      </Card>

      <Modal
        title="Applicant Profile"
        open={detailVisible}
        onCancel={() => { setDetailVisible(false); setSelectedApp(null); }}
        footer={null}
        width={600}
      >
        {selectedApp && (
          <div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Name">{selectedApp.seeker?.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedApp.seeker?.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedApp.seeker?.seekerProfile?.phone || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedApp.seeker?.seekerProfile?.location || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Title">{selectedApp.seeker?.seekerProfile?.title || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Experience">{selectedApp.seeker?.seekerProfile?.experience || 0} years</Descriptions.Item>
              <Descriptions.Item label="Education">{selectedApp.seeker?.seekerProfile?.education || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Skills">
                {selectedApp.seeker?.seekerProfile?.skills?.length > 0
                  ? selectedApp.seeker.seekerProfile.skills.map((s, i) => <Tag key={i}>{s}</Tag>)
                  : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
            {selectedApp.coverLetter && (
              <div style={{ marginTop: 16 }}>
                <Text strong>Cover Letter:</Text>
                <p style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{selectedApp.coverLetter}</p>
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <Text strong>Status: </Text>
              <Tag color={statusColors[selectedApp.status]}>{selectedApp.status?.toUpperCase()}</Tag>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Applicants;
