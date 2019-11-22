import { Avatar, Card, Icon, List, Tooltip, Row, Col, Typography } from 'antd';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { router } from 'umi';
import styles from './index.less';
import { PROJECT_TYPE } from '@/pages/constants';

const Projects = connect(({ loading, projects }) => ({
  projects,
  loading: loading.models.projects,
}))(props => {
  const {
    dispatch,
    projects: { list, pagination },
    loading,
  } = props;

  // const paginationProps = {
  //   current: Number(query.page),
  //   pageSize: 4,
  //   total: count,
  //   showQuickJumper: true,
  //   showTotal: total => `Total ${total} projects`,
  //   onChange: newPage =>
  //     router.push({
  //       pathname: path,
  //       query: {
  //         ...query,
  //         page: newPage,
  //       },
  //     }),
  // };

  return (
    <Card title="Explore">
      <List
        rowKey="id"
        className={styles.filterCardList}
        grid={{
          gutter: 24,
          xxl: 3,
          xl: 3,
          lg: 3,
          md: 2,
          sm: 2,
          xs: 1,
        }}
        loading={loading}
        dataSource={Object.values(list)}
        renderItem={item => (
          <List.Item key={item.id}>
            <Card
              hoverable
              bodyStyle={{
                paddingBottom: 20,
              }}
              actions={[
                <Tooltip title="Contribute" key="contribute">
                  <Icon type="highlight" onClick={() => router.push(`/annotation/${item.id}`)} />
                </Tooltip>,
                <Tooltip title="Share" key="share">
                  <Icon type="share-alt" />
                </Tooltip>,
              ]}
            >
              <Card.Meta
                avatar={<Avatar src={item.image} size="large" />}
                title={item.name}
                description={
                  <Row gutter={16} type="flex" justify="space-between">
                    <Col>
                      <Typography.Text strong>
                        {PROJECT_TYPE[item.project_type].tag}
                      </Typography.Text>
                    </Col>
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
    </Card>
  );
});

export default React.memo(Projects);
