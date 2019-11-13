import React from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';

import { Avatar, Card, Col, Skeleton, Row, Statistic, Button } from 'antd';
import styles from './index.less';
import Pie from './components/Pie';

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
  const {
    dispatch,
    dashboard: {
      statistics: { total = 0, remaining = 0 },
    },
    loading,
    statisticsLoading,
  } = props;

  /**
   * Init variables
   */
  const percent = Math.floor(((total - remaining) / total) * 100);
  console.log('[DEBUG]: percent', percent);
  // Effects
  React.useEffect(() => {
    dispatch({
      type: 'dashboard/fetchStatistics',
    });
  }, []);
  return (
    <div className={styles.main}>
      <PageHeaderWrapper
        content={<PageHeaderContent currentProject={currentProject} />}
        extraContent={<ExtraContent currentProject={currentProject} />}
        // support ant tab
      >
        <Row gutter={24}>
          <Col
            xl={16}
            lg={24}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Card
              title={
                <FormattedMessage
                  id="dashboardandmonitor.monitor.proportion-per-category"
                  defaultMessage="Proportion Per Category"
                />
              }
              bordered={false}
              className={styles.pieCard}
            >
              <Row
                style={{
                  padding: '16px 0',
                }}
              >
                <Col span={8}></Col>
                <Col span={8}></Col>
                <Col span={8}></Col>
              </Row>
            </Card>
          </Col>
          <Col
            xl={8}
            lg={12}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Card
              title={<FormattedMessage id="dashboard.progress" defaultMessage="Progress" />}
              bodyStyle={{
                textAlign: 'center',
                fontSize: 0,
              }}
              bordered={false}
              loading={statisticsLoading}
            >
              <Row
                style={{
                  padding: '16px 0',
                }}
              >
                <Pie
                  animate={false}
                  color="#2FC25B"
                  percent={percent}
                  title={
                    <FormattedMessage id="dashboard.progress.chart" defaultMessage="Progress" />
                  }
                  total={`${percent}%`}
                  height={128}
                  lineWidth={2}
                />
              </Row>
            </Card>
          </Col>
        </Row>
        Annotation Progress | User stats | Label stats
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
  statisticsLoading: loading.effects['dashboard/fetchStatistics'],
}))(Dashboard);
