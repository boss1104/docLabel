import { DownloadOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Avatar, Card, List, Tooltip, Row, Col, Typography } from 'antd';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { router } from 'umi';
import styles from './index.less';
import CreateModalForm from './CreateModalForm';
import { PROJECT_TYPE, PAGE_SIZE } from '@/pages/constants';

const Projects = connect(({ user, accountCenter, loading }) => ({
  currentUser: user.currentUser,
  myProjects: accountCenter.myProjects,
  loading: loading.effects['accountCenter/fetchMyProject'],
}))(props => {
  const {
    currentUser,
    myProjects: { list, pagination },
    loading,
    location: {
      query: { pp = 1, ...rest },
    },
    fetchMyProject,
  } = props;

  const dataLoading = loading || !list;

  const isSuperUser = currentUser && Object.keys(currentUser).length && currentUser.is_superuser;

  /** Handler */
  const handleOnChange = newPage => {
    router.push({
      query: { ...rest, pp: newPage },
    });
    fetchMyProject(newPage);
  };
  return (
    <React.Fragment>
      {isSuperUser && <CreateModalForm buttonText="New Project" className={styles.createModal} />}
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
          current: pp ? Number(pp) : 1,
        }}
        renderItem={item => {
          const stat = item.project_stat;
          const taskNumber = stat && stat.docs_stat && `${stat.docs_stat.count}`;
          const completeStatus = `${stat.total - stat.remaining}/${stat.total}`;
          const contributors = item && item.users && Object.keys(item.users).length;
          return (
            <List.Item key={item.id}>
              <Card
                hoverable
                bodyStyle={{
                  paddingBottom: 20,
                }}
                actions={[
                  <Tooltip title="Edit" key="edit">
                    <EditOutlined onClick={() => router.push(`/projects/${item.id}/dashboard`)} />
                  </Tooltip>,
                  <Tooltip title="Download" key="download">
                    <DownloadOutlined />
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
                    <Col span={8}>
                      {taskNumber} {taskNumber === 1 ? ' task' : ' tasks'}
                    </Col>
                    <Col span={8}>{completeStatus} done</Col>
                    <Col span={8}>{contributors} contributors</Col>
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

export default Projects;
