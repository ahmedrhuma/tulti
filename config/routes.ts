/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: './Layout',
    flatMenu: true,
    routes: [
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        component: './Dashboard',
      },
      {
        path: '/user/me',
        name: 'me',
        icon: 'user',
        component: './User/Me',
        exact: true,
        hideInMenu: true
      },
      // {
      //   path: '/items',
      //   name: 'items',
      //   icon: 'tags',
      //   component: './Items',
      //   access: 'readItems'
      // },
      // {
      //   path: '/patches',
      //   name: 'patches',
      //   icon: 'folderOpen',
      //   component: './Patches',
      //   access: 'readPatches',
      //   exact: true
      // },
      // {
      //   path: '/patches/:id',
      //   name: 'singlepatch',
      //   icon: 'folderOpen',
      //   component: './Patches/$1',
      //   access: 'readPatches',
      //   hideInMenu: true,
      //   exact: true
      // },
      // {
      //   path: '/customers',
      //   name: 'customers',
      //   icon: 'team',
      //   component: './Customers',
      //   access: 'readCustomers'
      // },
      // {
      //   path: '/storage',
      //   name: 'storage',
      //   icon: 'dropbox',
      //   component: './Storage',
      //   access: 'readStorages'
      // },
      // {
      //   path: '/sales',
      //   name: 'sales',
      //   icon: 'shoppingCart',
      //   component: './Sales',
      //   access: 'readSales'
      // },
      // {
      //   path: '/reservations',
      //   name: 'reservations',
      //   icon: 'container',
      //   component: './Reservations',
      //   access: 'readReservations'
      // },
      // {
      //   path: '/financial',
      //   name: 'financial',
      //   icon: 'sliders',
      //   component: './Financial',
      //   access: 'readFinancials'
      // },
      // {
      //   path: '/product/:id',
      //   name: 'product',
      //   icon: 'tag',
      //   hideInMenu: true,
      //   component: './Product',
      //   access: 'readStorages'
      // },
      {
        path: '/settings',
        name: 'settings',
        icon: 'Setting',
        routes: [
          {
            path: '/settings/groups',
            name: 'groups',
            icon: 'team',
            component: './Settings/Groups',
            access: 'manageGroups'
          },
          {
            path: '/settings/users',
            name: 'users',
            icon: 'team',
            component: './Settings/Users',
            access: 'readUsers'
          },
          {
            path: '/settings/general',
            name: 'general',
            icon: 'team',
            component: './Settings/Settings',
            access: 'manageSystem'
          }
        ]
      }
    ]
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
