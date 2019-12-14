import { Card, Col, Row, Tabs, Icon, Carousel } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import styles from './ContributionCard.less';
import Bar from './Bar';
import NumberInfo from './NumberInfo';
import Pie from './Pie';

const ContributionCard = ({ loading, userData, labelData, docStat }) => {
  const isReady = !loading && docStat && Object.keys(docStat).length;

  const getPercent = (remaining, annotation) =>
    Math.floor((annotation / (remaining + annotation)) * 100);

  const getTitle = () => {};
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
            <Tabs onChange={() => {}}>
              {isReady &&
                Object.entries(docStat).map(([key, val]) => (
                  <Tabs.TabPane
                    tab={
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
                            title={val.text.length > 7 ? `${val.text.slice(0, 7)}...` : val.text}
                            gap={2}
                            total={`${getPercent(val.remaining, val.annotation)}%`}
                            // theme={currentKey !== data.name ? 'light' : undefined}
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
                            percent={getPercent(val.remaining, val.annotation)}
                            height={64}
                          />
                        </Col>
                      </Row>
                    }
                    key={key}
                  />
                ))}
            </Tabs>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default ContributionCard;
