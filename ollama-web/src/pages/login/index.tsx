
import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.less';
import request from '@/utils/request';
import apiConfig from '../../../config/apiConfig';
import { history } from 'umi';
import { User } from '@/typeVo';

const { Title } = Typography;

/**
 * 登录页面组件
 * @description 使用 Ant Design 组件实现的登录页面，包含用户名和密码输入
 * @returns {React.ReactElement} 登录页面组件
 */
const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /**
   * 处理登录表单提交
   * @param {Object} values - 表单提交的值
   * @param {string} values.username - 用户名
   * @param {string} values.password - 密码
   */
  const handleSubmit = async (values: { userName: string; password: string }) => {
    setLoading(true);
    try {
      const { data, success } = await request.post<{ user: User, access_token: string }>(apiConfig.auth.login, values)
      if (success) {
        sessionStorage.setItem('token', data.access_token)
        sessionStorage.setItem('userInfo', JSON.stringify(data.user))
        history.replace('/')
      }
      // 登录成功后的处理
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.resetFields()
  }, [])

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <Card
          className="login-card"
          title={<div className='font-bold text-slate-900 text-xl'>登录</div>}
          // extra={<a href="#" className="forgot-password">注册</a>}
        >
          <Form
            initialValues={{}}
            form={form}
            onFinish={handleSubmit}
            layout='horizontal'
          >
            <Form.Item
              name="userName"
              // label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { whitespace: true, message: '用户名不能为空' }
              ]}
            >
              <Input
                autoComplete="off"
                prefix={<UserOutlined className="prefix-icon" />}
                placeholder="请输入用户名"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              // label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { whitespace: true, message: '密码不能为空' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="prefix-icon" />}
                placeholder="请输入密码"
                size="large"
                visibilityToggle
              />
            </Form.Item>

            {/* <a href="#" className="forgot-password">注册</a> */}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                size="large"
                loading={loading}
                block
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;