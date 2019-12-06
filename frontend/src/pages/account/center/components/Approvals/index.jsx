import { Avatar, Card, Icon, List, Tooltip, Row, Col, Typography } from 'antd';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { router } from 'umi';
import styles from './index.less';
import { PROJECT_TYPE, PAGE_SIZE } from '@/pages/constants';

const Approvals = connect(({ user, accountCenter, loading }) => ({
  currentUser: user.currentUser,
  myApprovals: accountCenter.myApprovals,
  loading: loading.effects['accountCenter/fetchMyApproval'],
}))(props => {
  const {
    currentUser,
    myApprovals: { list, pagination },
    loading,
    location: {
      query: { pc = 1, ...rest },
    },
    fetchMyApproval,
  } = props;

  const dataLoading = loading || loading === undefined;

  /** Handler */
  const handleOnChange = newPage => {
    router.push({
      query: { ...rest, pc: newPage },
    });
    fetchMyApproval(newPage);
  };
  return (
    <React.Fragment>
      <List
        rowKey="id"
        className={styles.filterCardList}
        grid={{
          gutter: 24,
          xxl: 2,
          xl: 2,
          lg: 2,
          md: 2,
          sm: 2,
          xs: 1,
        }}
        loading={dataLoading}
        dataSource={list}
        pagination={{
          onChange: handleOnChange,
          defaultPageSize: PAGE_SIZE,
          total: pagination.count,
          current: pc ? Number(pc) : 1,
        }}
        renderItem={item => (
          <List.Item key={item.id}>
            <Card
              hoverable
              bodyStyle={{
                paddingBottom: 20,
              }}
              actions={[
                <Tooltip title="Approval" key="approval">
                  <Icon
                    type="safety-certificate"
                    theme="twoTone"
                    onClick={() => router.push(`/annotation/${item.id}`)}
                  />
                </Tooltip>,
                <Tooltip title="Share" key="share">
                  <Icon type="share-alt" />
                </Tooltip>,
              ]}
            >
              <Card.Meta
                avatar={<Avatar src={item.image} />}
                title={item.name}
                description={
                  <Row gutter={16} type="flex" justify="space-between">
                    <Col>
                      <Typography.Text strong>
                        {PROJECT_TYPE[item.project_type].tag}
                      </Typography.Text>
                    </Col>
                    <Col>{item.public ? 'Published' : 'Unpublished'}</Col>
                  </Row>
                }
              />
              <div className={styles.cardInfo}>
                <div className={styles.paragraph}>
                  <Typography.Paragraph ellipsis={{ rows: 3 }}>
                    {item.description}
                  </Typography.Paragraph>
                </div>
                <Row type="flex" gutter={16} justify="end">
                  <Col>{moment(item.updated_at).fromNow()}</Col>
                </Row>
                <Row type="flex" gutter={16}>
                  <Col span={8}>task_number</Col>
                  <Col span={8}>complete status</Col>
                  <Col span={8}>contributors</Col>
                </Row>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </React.Fragment>
  );
});

export default Approvals;
