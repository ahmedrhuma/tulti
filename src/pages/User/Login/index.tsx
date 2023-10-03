import Footer from '@/components/Footer';
import { login } from '@/services/users/login';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import {  history, useModel, Helmet } from '@umijs/max';
import { message } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useEffect } from 'react';
import './index.less'


const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    if(initialState?.currentUser && Object.keys(initialState?.currentUser).length > 0) {
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
    }
  },[initialState])

  const handleSubmit = async (values: User.LoginParams) => {
    try {
      const msg = await login({ ...values, strategy: 'local' });
      console.log(msg);
      if (Object.keys(msg.users).length > 0) {
        const defaultLoginSuccessMessage = <div>أهلا بيك <strong>{msg.users.name}</strong></div>;
        message.success(defaultLoginSuccessMessage);
        setInitialState(initialState => ({
          ...initialState,
          currentUser: msg.users
        }))
        return;
      }
    } catch (error) {
      message.error('إسم المستخدم و/أو كلمة المرور غير صحيحين!');
    }
  };

  return (
    <div className="ahmedrhuma-login-container">
      <Helmet>
        <title>
          تسجيل الدخول
          - {Settings.title}
        </title>
      </Helmet>
      {/* <Lang /> */}
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          submitter={{
            searchConfig: {
              submitText: "تسجيل الدخول"
            }
          }}
          logo={<img alt="logo" src="/logo.png" />}
          title="إدارة التسويق"
          subTitle="نِـظام إدارة وتتبع الحملات الإعلانية"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="إسم المستخدم"
            rules={[
              {
                required: true,
                message: "إسم المستخدم إجباري!",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="كـلمة المرور"
            rules={[
              {
                required: true,
                message: "كلمة المرور إجبارية!",
              },
            ]}
          />
          {/* <div
            style={{
              marginBottom: 24,
            }}
          >
            <a>
              نسيت كلمة المرور؟
            </a>
          </div> */}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
