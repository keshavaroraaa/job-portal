import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Typography, Input, Select, Spin, Empty, Pagination, Card, Slider, Space, Tag, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { getAllJobs } from '../api/jobs';

const { Title } = Typography;

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    jobType: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    experienceLevel: searchParams.get('experience') || '',
  });

  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.location) params.location = filters.location;
      if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;

      const { data } = await getAllJobs(params);
      setJobs(data.data);
      setPagination(data.pagination);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.jobType) params.type = filters.jobType;
    if (filters.location) params.location = filters.location;
    if (filters.experienceLevel) params.experience = filters.experienceLevel;
    setSearchParams(params, { replace: true });
    fetchJobs(1);
  }, [filters, fetchJobs, setSearchParams]);

  const handlePageChange = (page) => {
    fetchJobs(page);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', jobType: '', location: '', experienceLevel: '' });
  };

  const hasFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Browse Jobs</Title>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input.Search
              placeholder="Search jobs..."
              allowClear
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Job Type"
              allowClear
              style={{ width: '100%' }}
              value={filters.jobType || undefined}
              onChange={(v) => setFilters({ ...filters, jobType: v || '' })}
              options={[
                { label: 'Full Time', value: 'full-time' },
                { label: 'Part Time', value: 'part-time' },
                { label: 'Contract', value: 'contract' },
                { label: 'Internship', value: 'internship' },
                { label: 'Remote', value: 'remote' },
              ]}
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              placeholder="Experience"
              allowClear
              style={{ width: '100%' }}
              value={filters.experienceLevel || undefined}
              onChange={(v) => setFilters({ ...filters, experienceLevel: v || '' })}
              options={[
                { label: 'Entry', value: 'entry' },
                { label: 'Mid', value: 'mid' },
                { label: 'Senior', value: 'senior' },
                { label: 'Lead', value: 'lead' },
              ]}
            />
          </Col>
          <Col xs={12} md={4}>
            <Input
              placeholder="Location"
              allowClear
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </Col>
          <Col xs={12} md={4}>
            <Input
              placeholder="Category"
              allowClear
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            />
          </Col>
          {hasFilters && (
            <Col xs={24} md={4}>
              <Button icon={<ClearOutlined />} onClick={clearFilters} block>
                Clear Filters
              </Button>
            </Col>
          )}
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
        </div>
      ) : jobs.length === 0 ? (
        <Empty
          description="No jobs found matching your criteria"
          style={{ padding: '80px 0' }}
        >
          <Button type="primary" onClick={clearFilters}>Clear Filters</Button>
        </Empty>
      ) : (
        <>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography.Text type="secondary">
              Showing {jobs.length} of {pagination.total} jobs
            </Typography.Text>
          </div>
          <Row gutter={[16, 16]}>
            {jobs.map((job) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={job.id}>
                <JobCard job={job} />
              </Col>
            ))}
          </Row>
          {pagination.totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;
