import { Card, Col, Row, Tabs } from 'antd';
import React from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import Bar from './Bar';
import styles from './ContributionCard.less';
import TaskInfo from './TaskInfo';

const ContributionCard = ({ loading, userData, labelData, docStat }) => {
  const isReady = !loading && docStat && Object.keys(docStat).length;

  return (
    <Card
      loading={loading}
      bordered={false}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.contributionCard}>
        <Tabs
          size="large"
          tabBarStyle={{
            marginBottom: 24,
          }}
        >
          <Tabs.TabPane
            tab={<FormattedMessage id="dashboard.user" defaultMessage="Contributors" />}
            key="users"
          >
            <Row type="flex" style={{ padding: '16px' }}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.userBar}>
                  <Bar
                    height={295}
                    title={
                      <FormattedMessage
                        id="dashboard.user-title"
                        defaultMessage="Annotations/User"
                      />
                    }
                    data={userData}
                  />
                </div>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<FormattedMessage id="dashboard.labels" defaultMessage="Labels" />}
            key="labels"
          >
            <Row
              type="flex"
              style={{
                padding: '16px',
              }}
            >
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.labelBar}>
                  <Bar
                    height={295}
                    color="rgba(255, 135, 24, 0.85)"
                    title={
                      <FormattedMessage
                        id="dashboard.labels-title"
                        defaultMessage="Annotations/Label"
                      />
                    }
                    data={labelData}
                  />
                </div>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<FormattedMessage id="dashboard.tasks" defaultMessage="Task Progress" />}
            key="tasks"
          >
            <Row gutter={[8, 8]} type="flex" style={{ padding: '0 24px' }}>
              {isReady &&
                Object.entries(docStat).map(([key, val]) => (
                  <Col key={key} xs={12} sm={8} xxl={6}>
                    <TaskInfo task={val} />
                  </Col>
                ))}
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default ContributionCard;
