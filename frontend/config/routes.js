export default [
  {
    path: '/test',
    component: './user/test',
  },
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'permission',
        path: '/user/permission',
        component: './user/permission',
      },
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './user/register',
      },
      {
        name: 'register-result',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register-confirm',
        path: '/user/register-confirm',
        component: './user/register-confirm',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            name: 'projects',
            icon: 'smile',
            path: '/projects',
            component: './projects',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
