import { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Typography, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../api/jobs';

const { Title } = Typography;
const { TextArea } = Input;

const CreateJob = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        applicationDeadline: values.applicationDeadline?.format('YYYY-MM-DD'),
        skills: values.skills ? values.skills.split(',').map((s) => s.trim()) : [],
      };
      await createJob(payload);
      message.success('Job posted successfully!');
      navigate('/dashboard/manage-jobs');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <Title level={4}>Post a New Job</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Job Title" rules={[{ required: true, message: 'Job title is required' }]}>
            <Input placeholder="e.g. Developer / FRONTEND  OR BACKEND DEV OR REACT MAIN DEVELOPER" size="large" />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Input placeholder="e.g. EngineeriNG / bUsiness / pr / marketing" size="large" />
          </Form.Item>

          <Form.Item name="description" label="Job Description" rules={[{ required: true, message: 'Description is required' }]}>
            <TextArea rows={6} placeholder="Describe the role" />
          </Form.Item>

          <Form.Item name="requirements" label="Requirements">
            <TextArea rows={4} placeholder="skills, experience, and qualifications required..." />
          </Form.Item>

          <Form.Item name="responsibilities" label="Responsibilities">
            <TextArea rows={4} placeholder="responsibilities..." />
          </Form.Item>

          <Form.Item name="skills" label="Required Skills (comma separated)">
            <Input placeholder="e.g. skills you require ( write as PostgreSQL, React, Node.js )" />
          </Form.Item>

          <Form.Item name="location" label="Location" rules={[{ required: true, message: 'Location is required' }]}>
            <Input placeholder="e.g. Delhi / Remote or anything" size="large" />
          </Form.Item>

          <Form.Item name="jobType" label="Job Type" rules={[{ required: true, message: 'Select job type' }]}>
            <Select size="large">
              <Select.Option value="full-time">Full Time</Select.Option>
              <Select.Option value="part-time">Part Time</Select.Option>
              <Select.Option value="contract">Contract</Select.Option>
              <Select.Option value="internship">Internship</Select.Option>
              <Select.Option value="remote">Remote</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="experienceLevel" label="Experience Level">
            <Select size="large">
              <Select.Option value="entry">Entry Level</Select.Option>
              <Select.Option value="mid">Mid Level</Select.Option>
              <Select.Option value="senior">Senior</Select.Option>
              <Select.Option value="lead">Lead</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="salaryMin" label="Minimum Salary">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="50000" size="large" />
          </Form.Item>

          <Form.Item name="salaryMax" label="Maximum Salary">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="150000" size="large" />
          </Form.Item>

          <Form.Item name="vacancies" label="Number of Vacancies" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} size="large" />
          </Form.Item>

          <Form.Item name="applicationDeadline" label="Application Deadline">
            <DatePicker style={{ width: '100%' }} size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Post Job
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateJob;
