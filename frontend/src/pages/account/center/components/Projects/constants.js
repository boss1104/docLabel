import React from 'react';

import { Icon, Tag } from 'antd';

export const PROJECT_TYPE = {
  TextClassificationProject: {
    icon: <Icon type="smile" theme="twoTone" />,
    label: <Tag color="purple">Document Classification</Tag>,
  },
  SequenceLabelingProject: {
    icon: <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />,
    label: <Tag color="magenta">Sequence Labeling</Tag>,
  },
  Seq2seqProject: {
    icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
    label: <Tag color="cyan">Sequence to Sequence</Tag>,
  },
};
