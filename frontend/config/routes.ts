import { IRoute } from 'umi-types';

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
        name: 'oauth',
        path: '/user/oauth/:key',
        component: './user/oauth',
      },
      {
        name: 'forgot-password',
        path: '/user/forgot-password',
        component: './user/auth/ForgotPassword',
      },
      {
        name: 'confirm-password',
        path: '/user/confirm-password/:uid/:token',
        component: './user/auth/ConfirmPassword',
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
            authority: ['is_project_admin'],
          },
          {
            name: 'task',
            icon: 'database',
            path: '/projects/:id/task',
            component: './project/task',
            authority: ['is_project_admin'],
          },
          {
            name: 'label',
            icon: 'flag',
            path: '/projects/:id/label',
            component: './project/label',
            authority: ['is_project_admin'],
          },
          {
            name: 'contributor',
            icon: 'team',
            path: '/projects/:id/contributor',
            component: './project/contributor',
            authority: ['is_project_admin'],
          },
          {
            name: 'export',
            icon: 'cloud-download',
            path: '/projects/:id/export',
            component: './project/export',
            authority: ['is_project_admin'],
          },
          {
            name: 'guide',
            icon: 'deployment-unit',
            path: '/projects/:id/guide',
            component: './project/guide',
            authority: ['is_project_admin'],
          },
          {
            name: 'setting',
            icon: 'setting',
            path: '/projects/:id/setting',
            component: './project/setting',
            authority: ['is_project_admin'],
          },
        ],
      },
      {
        path: '/annotation/:id',
        component: '../layouts/AnnotationLayout',
        routes: [
          {
            name: 'annotation',
            hideInMenu: true,
            path: '/annotation/:id',
            component: './annotation',
            authority: ['is_project_admin', 'is_annotator', 'is_annotation_approver'],
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/home',
          },
          {
            path: '/home',
            name: 'home',
            icon: 'home',
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
            icon: 'smile',
            component: './account/center',
          },
          {
            name: 'account-settings',
            hideInMenu: true,
            path: '/account/settings',
            component: './account/settings',
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
] as IRoute[];
