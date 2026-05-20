import { Card, Tag, Typography, Space, Button, Tooltip } from 'antd';
import {
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text, Title, Paragraph } = Typography;

const JobCard = ({ job }) => {
  if (!job) return null;

  const {
    id,
    title,
    location,
    salaryMin,
    salaryMax,
    salaryCurrency,
    jobType,
    experienceLevel,
    category,
    skills = [],
    vacancies,
    createdAt,
    employer,
    employerProfile,
  } = job;

  const companyName = employer?.employerProfile?.companyName || employer?.name || 'Unknown Company';
  const displaySalary = salaryMin && salaryMax
    ? `${salaryCurrency || 'INR'} ${Number(salaryMin).toLocaleString('en-IN')} - ${Number(salaryMax).toLocaleString('en-IN')}`
    : 'Salary not disclosed';

  const typeColors = {
    'full-time': 'blue',
    'part-time': 'orange',
    contract: 'purple',
    internship: 'green',
    remote: 'cyan',
  };

  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      actions={[
        <Link to={`/jobs/${id}`} key="view">
          <Button type="link">View Details</Button>
        </Link>,
      ]}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Title level={5} style={{ margin: 0, flex: 1 }}>
            <Link to={`/jobs/${id}`} style={{ color: 'inherit' }}>
              {title}
            </Link>
          </Title>
          <Tag color={typeColors[jobType] || 'default'} style={{ textTransform: 'capitalize' }}>
            {jobType?.replace('-', ' ')}
          </Tag>
        </div>

        <Space>
          <BankOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary">{companyName}</Text>
        </Space>

        <Space>
          <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary">{location}</Text>
        </Space>

        <Space>
          <DollarOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary">{displaySalary}</Text>
        </Space>

        <Space>
          <TeamOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary">{vacancies} {vacancies === 1 ? 'vacancy' : 'vacancies'}</Text>
          <ClockCircleOutlined style={{ color: '#8c8c8c', marginLeft: 12 }} />
          <Text type="secondary">{dayjs(createdAt).fromNow()}</Text>
        </Space>

        {category && <Tag>{category}</Tag>}

        {skills.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <Space wrap size={[4, 4]}>
              {skills.slice(0, 4).map((skill, i) => (
                <Tag key={i} color="default">{skill}</Tag>
              ))}
              {skills.length > 4 && (
                <Tooltip title={skills.slice(4).join(', ')}>
                  <Tag>+{skills.length - 4} more</Tag>
                </Tooltip>
              )}
            </Space>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default JobCard;
