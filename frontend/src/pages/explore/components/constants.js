import React from 'react';

import { Icon } from 'antd';

export const PROJECT_TYPE = {
  TextClassificationProject: {
    icon: <Icon type="smile" theme="twoTone" />,
    label: 'Document Classification',
  },
  SequenceLabelingProject: {
    icon: <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />,
    label: 'Sequence Labeling',
  },
  Seq2seqProject: {
    icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
    label: 'Sequence to Sequence',
  },
};
