import React from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';

import { Avatar, Card, Col, Skeleton, Row, Statistic, Button, Modal, message } from 'antd';

import styles from './index.less';
import Pie from './components/Pie';
import { PROJECT_TYPE } from '@/pages/constants';
import ContributionCard from './components/ContributionCard';

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
        <div className={styles.contentTitle}>{PROJECT_TYPE[currentProject.project_type].tag}</div>
        <div>{currentProject.title}</div>
      </div>
    </div>
  );
};
const ExtraContent = ({ currentProject, showConfirm, userNum, taskNum, labelNum }) => (
  <div className={styles.extraContent}>
    {currentProject.public ? (
      <div>
        <div className={styles.statItem}>
          <Statistic title="Contributors" value={userNum} />
        </div>
        <div className={styles.statItem}>
          <Statistic title="Tasks" value={taskNum} />
        </div>
        <div className={styles.statItem}>
          <Statistic title="Labels" value={labelNum} />
        </div>
        <div className={styles.statItem}>
          <Statistic title="Visit" value="..." />
        </div>
      </div>
    ) : (
      <div className={styles.publishButton}>
        <Button type="primary" size="large" onClick={showConfirm}>
          Publish project
        </Button>
      </div>
    )}
  </div>
);

const Dashboard = connect(({ project, dashboard, loading }) => ({
  currentProject: project.currentProject,
  dashboard,
  statisticsLoading: loading.effects['dashboard/fetchStatistics'],
}))(props => {
  const {
    dispatch,
    dashboard: {
      statistics: { total = 1, remaining = 0, doc_stat: docStat = {}, label = {}, user = {} },
    },
    statisticsLoading,
    currentProject,
  } = props;

  /**
   * Init variables
   */
  const percent = Math.floor(((total - remaining) / total) * 100);

  /**
   * Handlers
   */

  const changePublished = async () => {
    try {
      await dispatch({
        type: 'setting/updateProject',
        payload: {
          public: true,
        },
      });
      message.success('Successfully published project!');
    } catch (error) {
      message.error('Can not publish this project. Missing data');
    }
  };
  const fetchStatistics = async () => {
    const res = await dispatch({
      type: 'dashboard/fetchStatistics',
    });
    console.log('[DEBUG]: fetchStatistics -> res', res);
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Do you want to publish this project?',
      content: 'Please make sure import tasks and create labels before publishing',
      onOk: changePublished,
      onCancel() {},
    });
  };

  // Effects
  React.useEffect(() => {
    fetchStatistics();
  }, []);

  const userData = Object.entries(user).map(([key, value]) => ({
    x: key,
    y: value,
  }));

  const labelData = Object.entries(label).map(([key, value]) => ({
    x: key,
    y: value,
  }));

  return (
    <div className={styles.main}>
      <PageHeaderWrapper
        content={<PageHeaderContent currentProject={currentProject} />}
        extraContent={
          <ExtraContent
            currentProject={currentProject}
            showConfirm={showConfirm}
            userNum={Object.keys(user).length}
            taskNum={Object.keys(docStat).length}
            labelNum={Object.keys(label).length}
          />
        }
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
            <ContributionCard
              labelData={labelData}
              userData={userData}
              docStat={docStat}
              loading={statisticsLoading}
            />
          </Col>
          <Col
            xl={8}
            lg={24}
            sm={24}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Card
              title={<FormattedMessage id="dashboard.progress" defaultMessage="Project progress" />}
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
        {currentProject.public && <div>Daily graph | Weekly graph</div>}
        {!currentProject.public && <div>Link to add tasks, add labels</div>}
      </PageHeaderWrapper>
    </div>
  );
});

export default Dashboard;
