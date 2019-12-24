import { Col, Row, Typography } from 'antd';
import classNames from 'classnames';
import React from 'react';
import Pie from '../Pie';
import styles from './index.less';

const TaskInfo = ({ task, theme }) => {
  const { text, total, remaining } = task;
  const percent = Math.min(Math.floor(((total - remaining) / total) * 100), 100);
  const suffix = '%';
  return (
    <Row
      gutter={8}
      className={classNames(styles.numberInfo, {
        [styles[`numberInfo${theme}`]]: theme,
      })}
      style={{
        width: 138,
      }}
      type="flex"
    >
      <Col
        span={24}
        className={styles.numberInfoTitle}
        title={typeof text === 'string' ? text : ''}
      >
        <Typography.Paragraph ellipsis>{text}</Typography.Paragraph>
      </Col>
      <Col span={12} className={styles.numberInfoValue}>
        <span>
          {percent}
          {suffix && <em className={styles.suffix}>{suffix}</em>}
        </span>
      </Col>
      <Col span={12} className={styles.numberInfoChart}>
        <Pie
          animate={false}
          inner={0.55}
          tooltip={false}
          margin={[0, 0, 0, 0]}
          percent={percent}
          height={64}
        />
      </Col>
    </Row>
  );
};

export default TaskInfo;
