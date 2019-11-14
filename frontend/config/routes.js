export default [
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
        path: '/user/register-confirm/:key',
        component: './user/register-confirm',
      },
      {
        component: './exception/404',
      },
    ],
  },
  {
    path: '/exception',
    routes: [
      {
        name: '403',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        name: '500',
        path: '/exception/500',
        component: './exception/500',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/projects/:id',
        component: '../layouts/ProjectLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/projects/:id',
            redirect: '/projects/:id/dashboard',
          },
          {
            name: 'dashboard',
            icon: 'project',
            path: '/projects/:id/dashboard',
            component: './project/dashboard',
          },
          {
            name: 'task',
            icon: 'database',
            path: '/projects/:id/task',
            component: './project/task',
          },
          {
            name: 'label',
            icon: 'flag',
            path: '/projects/:id/label',
            component: './project/label',
          },
          {
            name: 'contributor',
            icon: 'team',
            path: '/projects/:id/contributor',
            component: './project/contributor',
          },
          {
            name: 'export',
            icon: 'cloud-download',
            path: '/projects/:id/export',
            component: './project/export',
          },
          {
            name: 'setting',
            icon: 'setting',
            path: '/projects/:id/setting',
            component: './project/setting',
          },
          {
            name: 'guide',
            icon: 'deployment-unit',
            path: '/projects/:id/guide',
            component: './project/guide',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/home',
          },
          {
            path: '/home',
            name: 'home',
            icon: 'smile',
            component: './Home',
          },
          {
            name: 'explore',
            icon: 'monitor',
            path: '/explore',
            component: './explore',
          },
          {
            name: 'account-center',
            path: '/account/center',
            icon: 'profile',
            component: './account/center',
          },
          {
            name: 'account-settings',
            hideInMenu: true,
            path: '/account/settings',
            component: './account/settings',
          },
          {
            name: 'annotation',
            hideInMenu: true,
            path: '/annotation/projects/:id',
            component: './annotation',
          },
        ],
      },
      {
        component: './exception/404',
      },
    ],
  },
  {
    component: './exception/404',
  },
];
