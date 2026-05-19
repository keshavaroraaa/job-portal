import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, Descriptions, Tag, Button, Typography, Spin, Space, Divider, Modal, Input, message, Row, Col, Alert, Tooltip
} from 'antd';
import {
  EnvironmentOutlined, DollarOutlined, ClockCircleOutlined, TeamOutlined,
  BankOutlined, FileTextOutlined, SendOutlined, ArrowLeftOutlined,
  CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getJobById } from '../api/jobs';
import { applyForJob } from '../api/applications';
import { AuthContext } from '../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await getJobById(id);
        setJob(data.data.job);
      } catch {
        message.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async () => {
    if (!user) {
      message.info('Please login to apply');
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (user.role !== 'job_seeker') {
      message.error('Only job seekers can apply');
      return;
    }
    setApplyModal(true);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      await applyForJob(id, { coverLetter });
      message.success('Application submitted successfully!');
      setApplyModal(false);
      setCoverLetter('');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!job) return null;

  const typeColors = {
    'full-time': 'blue', 'part-time': 'orange', contract: 'purple', internship: 'green', remote: 'cyan',
  };
  const expColors = { entry: 'green', mid: 'orange', senior: 'red', lead: 'purple' };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ padding: 0, marginBottom: 16 }}
      >
        Back to Jobs
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <Title level={3} style={{ margin: 0 }}>{job.title}</Title>
                <Space style={{ marginTop: 8 }}>
                  <BankOutlined /> <Text>{job.employer?.employerProfile?.companyName || job.employer?.name}</Text>
                </Space>
              </div>
              <Space>
                <Tag color={typeColors[job.jobType]}>{job.jobType?.replace('-', ' ')}</Tag>
                <Tag color={expColors[job.experienceLevel]}>{job.experienceLevel}</Tag>
              </Space>
            </div>

            <Divider />

            <Space wrap size={[24, 12]} style={{ marginBottom: 16 }}>
              <Space><EnvironmentOutlined /> <Text>{job.location}</Text></Space>
              <Space><DollarOutlined /> <Text>
                {job.salaryMin && job.salaryMax
                  ? `₹{job.salaryCurrency || 'INR'} ₹{Number(job.salaryMin).toLocaleString()} - ₹{Number(job.salaryMax).toLocaleString()}`
                  : 'Salary not disclosed'}
              </Text></Space>
              <Space><TeamOutlined /> <Text>{job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}</Text></Space>
              <Space><CalendarOutlined /> <Text>Deadline: {job.applicationDeadline ? dayjs(job.applicationDeadline).format('MMM D, YYYY') : 'Rolling'}</Text></Space>
            </Space>

            <Divider />

            <Title level={5}>Description</Title>
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{job.description}</Paragraph>

            {job.responsibilities && (
              <>
                <Title level={5}>Responsibilities</Title>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{job.responsibilities}</Paragraph>
              </>
            )}

            {job.requirements && (
              <>
                <Title level={5}>Requirements</Title>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{job.requirements}</Paragraph>
              </>
            )}

            {job.skills?.length > 0 && (
              <>
                <Title level={5}>Skills</Title>
                <Space wrap>
                  {job.skills.map((skill, i) => <Tag key={i} color="blue">{skill}</Tag>)}
                </Space>
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card>
            <Title level={5}>Job Overview</Title>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Category">{job.category || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={typeColors[job.jobType]}>{job.jobType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Experience">
                <Tag color={expColors[job.experienceLevel]}>{job.experienceLevel}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
              <Descriptions.Item label="Posted">{dayjs(job.createdAt).format('MMM D, YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Vacancies">{job.vacancies}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Company Info</Title>
            <Space direction="vertical">
              <Text strong>{job.employer?.employerProfile?.companyName || job.employer?.name}</Text>
              {job.employer?.employerProfile?.industry && <Text>Industry: {job.employer.employerProfile.industry}</Text>}
              {job.employer?.employerProfile?.companySize && <Text>Size: {job.employer.employerProfile.companySize}</Text>}
              {job.employer?.employerProfile?.companyWebsite && (
                <a href={job.employer.employerProfile.companyWebsite} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              )}
            </Space>

            {job.employer?.employerProfile?.companyDescription && (
              <>
                <Divider />
                <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                  {job.employer.employerProfile.companyDescription}
                </Paragraph>
              </>
            )}

            <Divider />

            {job.status === 'open' ? (
              <Button type="primary" size="large" block icon={<SendOutlined />} onClick={handleApply}>
                Apply Now
              </Button>
            ) : (
              <Alert message="This position is no longer accepting applications" type="warning" showIcon />
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title="Submit Application"
        open={applyModal}
        onCancel={() => { setApplyModal(false); setCoverLetter(''); }}
        footer={[
          <Button key="cancel" onClick={() => { setApplyModal(false); setCoverLetter(''); }}>Cancel</Button>,
          <Button key="submit" type="primary" loading={applying} onClick={submitApplication} icon={<SendOutlined />}>
            Submit Application
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <Text>Apply for: <strong>{job.title}</strong></Text>
          <Input.TextArea
            rows={6}
            placeholder="Write a cover letter (optional)"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default JobDetails;
