import { Card, Col, Row, Tabs } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import styles from './ContributionCard.less';
import Bar from './Bar';
import NumberInfo from './NumberInfo';
import Pie from './Pie';

const CustomPie = ({ percent, name }) => (
  <Row
    gutter={8}
    style={{
      width: 138,
      margin: '8px 0',
    }}
    type="flex"
  >
    <Col span={12}>
      <NumberInfo
        // subTitle=""
        title={name.length > 7 ? `${name.slice(0, 7)}...` : name}
        gap={2}
        total={`${percent}%`}
      />
    </Col>
    <Col
      span={12}
      style={{
        paddingTop: 36,
      }}
    >
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

const ContributionCard = ({ loading, userData, labelData, docStat }) => {
  const isReady = !loading && docStat && Object.keys(docStat).length;

  const getPercent = (remaining, annotation) =>
    Math.floor((annotation / (remaining + annotation)) * 100);

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
            <Row
              type="flex"
              style={{
                padding: '16px',
              }}
            >
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.userBar}>
                  <Bar
                    height={295}
                    title={
                      <FormattedMessage id="dashboard.user-title" defaultMessage="Users stat" />
                    }
                    data={userData}
                  />
                </div>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={<FormattedMessage id="dashboard.labels" defaultMessage="Label" />}
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
                      <FormattedMessage id="dashboard.labels-title" defaultMessage="Labels Stat" />
                    }
                    data={labelData}
                  />
                </div>
              </Col>
            </Row>
          </Tabs.TabPane>
          {/* <Tabs.TabPane
            tab={<FormattedMessage id="dashboard.tasks" defaultMessage="Task Progress" />}
            key="tasks"
          >
            <Row
              type="flex"
              style={{
                padding: '16px',
              }}
            >
              {isReady &&
                Object.entries(docStat).map(([key, val]) => (
                  <Col xl={24} lg={24} md={24} sm={24} xs={24} key={key}>
                    <div className={styles.taskBar}>
                      <CustomPie percent={getPercent(val.remaining, val.annotation)} name={key} />
                    </div>
                  </Col>
                ))}
            </Row>
          </Tabs.TabPane> */}
        </Tabs>
      </div>
    </Card>
  );
};

export default ContributionCard;
