import {
  CheckCircleTwoTone,
  GithubFilled,
  GitlabFilled,
  GoogleCircleFilled,
  HeartTwoTone,
  SmileTwoTone,
} from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import { Tag } from 'antd';
import React from 'react';

export enum ProjectTypes {
  TextClassificationProject = 'TextClassificationProject',
  SequenceLabelingProject = 'SequenceLabelingProject',
  Seq2seqProject = 'Seq2seqProject',
  PdfLabelingProject = 'PdfLabelingProject',
}

export const PAGE_SIZE = 6;

export const PROJECT_TYPE: Record<
  ProjectTypes,
  {
    icon: React.ReactNode;
    label: string;
    tag: React.ReactNode;
  }
> = {
  TextClassificationProject: {
    icon: <SmileTwoTone />,
    label: 'Sentiment Analysis',
    tag: <Tag color="purple">Sentiment Analysis</Tag>,
  },
  SequenceLabelingProject: {
    icon: <HeartTwoTone twoToneColor="#eb2f96" />,
    label: 'Named Entity Recognition',
    tag: <Tag color="magenta">Named Entity Recognition</Tag>,
  },
  Seq2seqProject: {
    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
    label: 'Translation',
    tag: <Tag color="cyan">Translation</Tag>,
  },
  PdfLabelingProject: {
    icon: <HeartTwoTone twoToneColor="#eb2f96" />,
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

export type ProviderTypes = 'github' | 'google-oauth2' | 'gitlab';

export const LOGIN_PROVIDERS: Array<{
  provider: ProviderTypes;
  title: string;
  IconProvider: (props: AntdIconProps) => JSX.Element;
}> = [
  {
    provider: 'github',
    title: 'Github',
    IconProvider: (props: AntdIconProps) => <GithubFilled {...props} />,
  },
  {
    provider: 'google-oauth2',
    title: 'Google',
    IconProvider: (props: AntdIconProps) => <GoogleCircleFilled {...props} />,
  },
  {
    provider: 'gitlab',
    title: 'Gitlab',
    IconProvider: (props: AntdIconProps) => <GitlabFilled {...props} />,
  },
];

export const REDIRECT_URI = 'http://doclabel.test/user/oauth/';
