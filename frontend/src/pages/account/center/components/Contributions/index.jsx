import { HighlightTwoTone, ShareAltOutlined } from '@ant-design/icons';
import { Avatar, Card, List, Tooltip, Row, Col, Typography } from 'antd';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { router } from 'umi';
import styles from './index.less';
import { PROJECT_TYPE, PAGE_SIZE } from '@/pages/constants';

const Contributions = connect(({ user, accountCenter, loading }) => ({
  currentUser: user.currentUser,
  myContributions: accountCenter.myContributions,
  loading: loading.effects['accountCenter/fetchMyContribution'],
}))(props => {
  const {
    currentUser,
    myContributions: { list, pagination },
    loading,
    location: {
      query: { pc = 1, ...rest },
    },
    fetchMyContribution,
  } = props;

  const dataLoading = loading || loading === undefined;

  /** Handler */
  const handleOnChange = newPage => {
    router.push({
      query: { ...rest, pc: newPage },
    });
    fetchMyContribution(newPage);
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
        renderItem={item => {
          const stat = item.project_stat;
          const isDone = stat.remaining === 0;
          const taskNumber = stat && stat.docs_stat && `${stat.docs_stat.count}`;
          const completeStatus = `${stat.total - stat.remaining}/${stat.total}`;
          return (
            <List.Item key={item.id}>
              <Card
                hoverable
                bodyStyle={{
                  paddingBottom: 20,
                }}
                actions={[
                  <Tooltip title="Contribute" key="contribute">
                    <HighlightTwoTone onClick={() => router.push(`/annotation/${item.id}`)} />
                  </Tooltip>,
                  <Tooltip title="Share" key="share">
                    <ShareAltOutlined />
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
                      <Col>{isDone ? 'Done' : 'On progress'}</Col>
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
                    <Col span={12}>
                      {taskNumber} {taskNumber === 1 ? ' task' : ' tasks'}
                    </Col>
                    <Col span={12}>{completeStatus} done</Col>
                  </Row>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
    </React.Fragment>
  );
});

export default Contributions;
