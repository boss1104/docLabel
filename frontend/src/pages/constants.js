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
    label: 'Sequence to Sequence',
    tag: <Tag color="cyan">Sequence to Sequence</Tag>,
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
