import { PROJECT_TYPE } from '@/pages/constants';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Card, Col, message, Modal, Row, Skeleton, Statistic } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { Link } from 'umi';
import { FormattedMessage } from 'umi-plugin-react/locale';
import ContributionCard from './components/ContributionCard';
import Pie from './components/Pie';
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
        <Button type="primary" size="large" onClick={showConfirm} icon={<PlayCircleOutlined />}>
          Publish project
        </Button>
      </div>
    )}
  </div>
);

const Dashboard = props => {
  const {
    dispatch,
    dashboard: {
      statistics: { total = 1, remaining = 0, docs_stat: docStat = {}, label = {}, user = {} },
    },
    statisticsLoading,
    currentProject,
  } = props;

  /**
   * Init variables
   */
  const percent = Math.min(Math.floor(((total - remaining) / total) * 100), 100);

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
      content:
        'Please make sure that you has already imported project tasks and created labels before publishing',
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

  const showTaskAlert = true;

  const showLabelAlert = true;

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
        {currentProject.public && (
          <React.Fragment>
            <Alert
              showIcon
              type="info"
              description={
                <Link to={`/annotation/${currentProject && currentProject.id}`}>
                  Go to Annotation
                </Link>
              }
              style={{ marginBottom: 24 }}
            />
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
                  title={
                    <FormattedMessage id="dashboard.progress" defaultMessage="Project progress" />
                  }
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
          </React.Fragment>
        )}
        {!currentProject.public && (
          <div>
            {showTaskAlert && (
              <Alert
                showIcon
                type="info"
                message="Add a task to project"
                description={
                  <Link to={`/projects/${currentProject && currentProject.id}/task`}>
                    Go to Tasks
                  </Link>
                }
              />
            )}
            {showLabelAlert && (
              <Alert
                showIcon
                type="info"
                message="Define the label for tasks"
                description={
                  <Link to={`/projects/${currentProject && currentProject.id}/label`}>
                    Go to Labels
                  </Link>
                }
                style={{ marginTop: 24 }}
              />
            )}
          </div>
        )}
      </PageHeaderWrapper>
    </div>
  );
};

export default connect(({ project, dashboard, loading }) => ({
  currentProject: project.currentProject,
  dashboard,
  statisticsLoading: loading.effects['dashboard/fetchStatistics'],
}))(Dashboard);
