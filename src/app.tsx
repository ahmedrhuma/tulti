import Footer from '@/components/Footer';
import { ConfigProvider } from 'antd';
import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import {Helmet} from "react-helmet";
import { history, getLocale } from '@umijs/max';
import app from '@/connect';
import defaultSettings from '../config/defaultSettings';
import arEG from 'antd/lib/locale/ar_EG';
import { subscribeNotification } from './services/system';
import isMobile from './isMobile';
import React from 'react';
import { getMessaging, getToken } from '@/firebase'
import moment from 'moment';
import 'moment/locale/ar-ly'
moment.locale('ar-LY')

const loginPath = '/user/login';

const permission = () => {
  Notification.requestPermission().catch(() => {});
}

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
    
      getToken(getMessaging, { vapidKey: 'BDMZeek6DeNzeJhOjaDuBN5gQm-YumRLy953j6blXf8nGWJFt8rYh6RuGEqcyj2Os35bF1vMbzWQhV5pAkbcLoM' }).then((currentToken) => {
        if (currentToken) {
          subscribeNotification(currentToken).catch(() => {})
        } else {
          // Show permission request UI
          permission();
        }
      }).catch(() => {})
    }
    catch(e) {}
    try {
      const msg = await app.reAuthenticate();
      return msg.users;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    disableMobile:true,
    layoutBgImgList: [],
    links: [],
    menuHeaderRender: undefined,
    defaultCollapsed: true,
    className: isMobile() ? 'ahmedrhuma-is-mobile-container' : '',
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {history?.location?.pathname === "/settings/general" ? <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          /> : null}
        </>
      );
    },
    ...initialState?.settings,
  };
};

export function rootContainer(container: JSX.Element) {

  const isAR = String(getLocale()).startsWith('ar');

  return (
    <>
      <Helmet defaultTitle="إدارة التسويق" titleTemplate="إدارة التسويق - %s">
        <html lang={isAR ? 'ar' : 'en'} dir={isAR ? 'rtl' : 'ltr'} />

      </Helmet>
      <ConfigProvider locale={isAR ? arEG: undefined} direction={isAR ? 'rtl' : 'ltr'}>
        {container}
      </ConfigProvider>
    </>
  )
}