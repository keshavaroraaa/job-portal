import { useContext, useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message, Spin, Divider, Tag, Select, InputNumber, Space } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { updateProfile, changePassword } from '../api/profile';
import { getMeAPI } from '../api/auth';

const { Title, Text } = Typography;

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data } = await getMeAPI();
          const userData = data.data.user;
          setProfileData(userData);
          if (user.role === 'employer' && userData.employerProfile) {
            profileForm.setFieldsValue(userData.employerProfile);
          } else if (user.role === 'job_seeker' && userData.seekerProfile) {
            const sp = userData.seekerProfile;
            profileForm.setFieldsValue({
              ...sp,
              skills: sp.skills?.join(', ') || '',
            });
          }
        } catch {
          //
        }
      };
      fetchProfile();
    }
  }, [user, profileForm]);

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    try {
      let payload;
      if (user.role === 'job_seeker') {
        payload = {
          ...values,
          skills: values.skills ? values.skills.split(',').map((s) => s.trim()) : [],
        };
      } else {
        payload = values;
      }
      const { data } = await updateProfile(payload);
      setUser(data.data.user);
      message.success('Profile updated successfully');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setPasswordLoading(true);
    try {
      await changePassword(values);
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!profileData) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <Title level={4}>Profile Settings</Title>

      <Card title="Account Info" style={{ marginBottom: 24 }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role === 'employer' ? 'Employer' : 'Job Seeker'}</p>
      </Card>

      <Card title={user.role === 'employer' ? 'Company Profile' : 'My Profile'} style={{ marginBottom: 24 }}>
        <Form form={profileForm} layout="vertical" onFinish={handleProfileUpdate}>
          {user.role === 'employer' ? (
            <>
              <Form.Item name="companyName" label="Company Name">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="companyWebsite" label="Website">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="industry" label="Industry">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="companySize" label="Company Size">
                <Select size="large">
                  <Select.Option value="1-10">1-10 employees</Select.Option>
                  <Select.Option value="11-50">11-50 employees</Select.Option>
                  <Select.Option value="51-200">51-200 employees</Select.Option>
                  <Select.Option value="201-1000">201-1000 employees</Select.Option>
                  <Select.Option value="1000+">1000+ employees</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="location" label="Location">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="companyDescription" label="Company Description">
                <Input.TextArea rows={4} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item name="title" label="Professional Title">
                <Input placeholder="e.g. Senior Software Engineer" size="large" />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="location" label="Location">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="bio" label="Bio">
                <Input.TextArea rows={3} placeholder="Tell employers about yourself..." />
              </Form.Item>
              <Form.Item name="skills" label="Skills (comma separated)">
                <Input placeholder="e.g. React, Node.js, Python" size="large" />
              </Form.Item>
              <Form.Item name="experience" label="Years of Experience">
                <InputNumber min={0} style={{ width: '100%' }} size="large" />
              </Form.Item>
              <Form.Item name="education" label="Education">
                <Input placeholder="e.g. B.S. Computer Science" size="large" />
              </Form.Item>
              <Form.Item name="linkedInUrl" label="LinkedIn URL">
                <Input size="large" />
              </Form.Item>
              <Form.Item name="githubUrl" label="GitHub URL">
                <Input size="large" />
              </Form.Item>
            </>
          )}
          <Button type="primary" htmlType="submit" loading={loading}>Save Changes</Button>
        </Form>
      </Card>

      <Card title="Change Password">
        <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={passwordLoading}>Change Password</Button>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
