import React from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';

import {
  Avatar,
  Card,
  Col,
  Skeleton,
  Row,
  Statistic,
  Button,
  Icon,
  Tag,
  Popconfirm,
  Modal,
  message,
} from 'antd';

import styles from './index.less';
import Pie from './components/Pie';
import { PROJECT_TYPE } from '@/pages/constants';

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
const ExtraContent = ({ currentProject, showConfirm }) => (
  <div className={styles.extraContent}>
    {currentProject.public ? (
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
      statistics: { total = 0, remaining = 0 },
    },
    loading,
    statisticsLoading,
    currentProject,
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

  function showConfirm() {
    Modal.confirm({
      title: 'Do you want to publish this project?',
      content: 'Please make sure import tasks and create labels before publishing',
      onOk: changePublished,
      onCancel() {},
    });
  }

  return (
    <div className={styles.main}>
      <PageHeaderWrapper
        content={<PageHeaderContent currentProject={currentProject} />}
        extraContent={<ExtraContent currentProject={currentProject} showConfirm={showConfirm} />}
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
        {currentProject.public ? (
          <div>Link to add tasks, add labels</div>
        ) : (
          <div>Daily graph | Weekly graph</div>
        )}
      </PageHeaderWrapper>
    </div>
  );
});

export default Dashboard;
