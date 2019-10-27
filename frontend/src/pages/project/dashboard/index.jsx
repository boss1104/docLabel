import React from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Card, Col, List, Skeleton, Row, Statistic, Button } from 'antd';
import styles from './index.less';

const PageHeaderContent = ({ currentProject }) => {
  const loading = currentProject && Object.keys(currentProject).length;

  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentProject.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>{currentProject.name}</div>
        <div className={styles.contentTitle}>currentProject.project_type</div>
        <div>
          {currentProject.title} |{currentProject.group}
        </div>
      </div>
    </div>
  );
};
const ExtraContent = ({ currentProject }) => (
  <div className={styles.extraContent}>
    {currentProject.isPublish ? (
      <div>
        <div className={styles.statItem}>
          <Statistic title="Number of items" value={56} />
        </div>
        <div className={styles.statItem}>
          <Statistic title="Team ranking" value={8} suffix="/ 24" />
        </div>
        <div className={styles.statItem}>
          <Statistic title="Project visit" value={2223} />
        </div>
      </div>
    ) : (
      <Button>Publish project</Button>
    )}
  </div>
);

const Dashboard = props => {
  const currentProject = {
    name: 'Hello world',
    title: 'title',
    avatar: 'avatar',
    group: 'group',
    isPublish: false,
  };
  const { dispatch } = props;
  return (
    <div className={styles.main}>
      <PageHeaderWrapper
        content={<PageHeaderContent currentProject={currentProject} />}
        extraContent={<ExtraContent currentProject={currentProject} />}
        // support ant tab
      >
        {/* It's tab content */}
        {currentProject.isPublish ? (
          <div>Link to add tasks, add labels</div>
        ) : (
          <div>Daily graph | Weekly graph</div>
        )}
      </PageHeaderWrapper>
    </div>
  );
};

export default connect(({ dashboard, loading }) => ({
  dashboard,
  loading: loading.models.dashboard,
}))(Dashboard);
