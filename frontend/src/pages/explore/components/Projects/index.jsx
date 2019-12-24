import {
  Avatar,
  Card,
  Icon,
  List,
  Tooltip,
  Row,
  Col,
  Typography,
  Modal,
  Select,
  message,
} from 'antd';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { router } from 'umi';
import { stringify } from 'querystring';
import styles from './index.less';
import { PROJECT_TYPE, ROLE_LABELS, PAGE_SIZE } from '@/pages/constants';

function Projects({
  dispatch,
  projects: { list, pagination },
  loading,
  location: { query },
  currentUser,
}) {
  const [visible, setVisible] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState('annotator');
  const [selectedProject, setSelectedProject] = React.useState({});

  const handleSentRequest = async projectId => {
    try {
      await dispatch({
        type: 'projects/requestJoinProject',
        payload: {
          projectId,
          role: selectedRole,
        },
      });
      message.success('Successfully sent request!');
      setVisible(false);
    } catch ({ data }) {
      console.log('[DEBUG]: data', data);
      message.error(data[0]);
    }
  };

  const isProjectGuest = project => project.current_users_role.is_guest;
  const isLogin = currentUser && currentUser.id;

  return (
    <Card title="Explore">
      <Modal
        title={`Request to join project "${selectedProject.name}"`}
        visible={visible}
        onOk={() => handleSentRequest(selectedProject.id)}
        onCancel={() => setVisible(false)}
        centered
      >
        <Row gutter={16} type="flex" justify="space-between">
          <Col span={4} style={{ lineHeight: '38px', fontSize: '16px' }}>
            Role:
          </Col>
          <Col span={20}>
            <Select
              size="large"
              style={{ width: '240px' }}
              value={selectedRole}
              onChange={value => setSelectedRole(value)}
            >
              <Select.Option value="annotator">{ROLE_LABELS.annotator}</Select.Option>
              <Select.Option value="annotation_approver">
                {ROLE_LABELS.annotation_approver}
              </Select.Option>
            </Select>
          </Col>
        </Row>
      </Modal>

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
        pagination={{
          onChange: newPage => {
            router.push({
              query: {
                ...query,
                page: newPage,
              },
            });
            // refetchProject(newPage);
          },
          defaultPageSize: PAGE_SIZE,
          total: pagination.count,
          current: query.page ? Number(query.page) : 1,
          showQuickJumper: true,
          showTotal: total => `Total ${total} projects`,
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
                  <React.Fragment>
                    {!isProjectGuest(item) ? (
                      <Tooltip title="Contribute" key="contribute">
                        <Icon
                          type="highlight"
                          theme="twoTone"
                          onClick={() => router.push(`/annotation/${item.id}`)}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Contribute" key="contribute">
                        <Icon
                          type="notification"
                          theme="twoTone"
                          onClick={() => {
                            if (isLogin) {
                              setVisible(true);
                              setSelectedProject(item);
                            } else {
                              const queryString = stringify({
                                redirect: window.location.href,
                              });
                              router.replace(`/user/login?${queryString}`);
                            }
                          }}
                        />
                      </Tooltip>
                    )}
                  </React.Fragment>,
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
                  <Row type="flex" gutter={16} justify="end" className={styles.day}>
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
    </Card>
  );
}

export default connect(({ loading, projects, user }) => ({
  projects,
  loading: loading.models.projects,
  currentUser: user.currentUser,
}))(Projects);
