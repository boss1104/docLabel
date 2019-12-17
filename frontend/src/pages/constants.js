import React from 'react';
import { Icon, Tag } from 'antd';

export const PAGE_SIZE = 6;

export const PROJECT_TYPE = {
  TextClassificationProject: {
    icon: <Icon type="smile" theme="twoTone" />,
    label: 'Sentiment Analysis',
    tag: <Tag color="purple">Sentiment Analysis</Tag>,
  },
  SequenceLabelingProject: {
    icon: <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />,
    label: 'Named Entity Recognition',
    tag: <Tag color="magenta">Named Entity Recognition</Tag>,
  },
  Seq2seqProject: {
    icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
    label: 'Translation',
    tag: <Tag color="cyan">Translation</Tag>,
  },
  PdfLabelingProject: {
    icon: <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />,
    label: 'PDF Labeling',
    tag: <Tag color="blue">PDF Labeling</Tag>,
  },
};

export const ROLE_COLORS = {
  1: 'red',
  2: 'volcano',
  3: 'orange',
};

export const ROLE_LABELS = {
  project_admin: 'Project Admin',
  annotator: 'Annotator',
  annotation_approver: 'Annotation Approver',
};

export const loginProviderSettings = {
  google: {
    authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope:
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    clientId: '330749056763-076b62f8he375ko10pshrdsa2ap2qoe1.apps.googleusercontent.com',
    clientSecret: '7B8sNcYXdK406jTSLD2YxY6P',
    redirectUri: 'http://localhost:8001/app/user/oauth/google',
  },
  github: {
    authorizationUri: 'https://github.com/login/oauth/authorize',
    scope: 'user:email',
    clientId: '821fd7d157afbca77993',
    clientSecret: '3e10a99d8057ff916944a4a0b950ec90a9ae13ae',
    redirectUri: 'http://localhost:8001/app/user/oauth/github',
  },
  facebook: {
    authorizationUri:
      'https://facebook.com/login/oauth/authorize?scope=user&client_id=821fd7d157afbca77993',
    scope:
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',

    clientId: '821fd7d157afbca77993',
    clientSecret: '3e10a99d8057ff916944a4a0b950ec90a9ae13ae',

    redirectUri: 'http://localhost:8001/app/user/oauth/github',
  },
};

export const loginProviders = {
  google: {
    title: 'Google',
    type: 'google-circle',
    theme: 'filled',
  },
  github: {
    title: 'GitHub',
    type: 'github',
    theme: 'filled',
  },
  facebook: {
    title: 'Facebook',
    type: 'facebook',
    theme: 'filled',
  },
};
