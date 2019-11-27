import React from 'react';
import {
  Menu,
  Icon,
  Layout,
  Input,
  Spin,
  Row,
  Col,
  Typography,
  Descriptions,
  Button,
  Modal,
} from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import className from 'classnames';
import styles from './index.less';
import { PROJECT_TYPE } from '@/pages/constants';

const { Sider } = Layout;
const { Search } = Input;

const SiderList = connect(({ project, task, loading, settings }) => ({
  project,
  task,
  projectLoading: loading.effects['project/fetchProject'],
  taskLoading: loading.effects['task/fetch'],
  dark: settings.navTheme === 'dark',
}))(props => {
  const {
    dispatch,
    project: { currentProject },
    task: { list, pagination },
    projectLoading,
    taskLoading,
    // Parent props
    onChangeKey,
    pageSize,
    page,
    pageNumber,
    annotations = [],
    dark,
    remaining,
    annoList = [],
  } = props;
  const [collapsed, setCollapsed] = React.useState(false);

  /**
   * Handle Function
   */
  const handleOnSearch = value => {
    console.log('TCL: value', value);
  };

  const onCollapse = (newCollapsed, type) => {
    console.log('[DEBUG]: onCollapse -> type', type);
    setCollapsed(newCollapsed);
  };

  const submitTaskCompleted = () => {
    try {
      console.log('run');
      dispatch({
        type: 'annotation/confirm',
        payload: {},
      });
    } catch (error) {
      console.log('[DEBUG]: submitTaskCompleted -> error', error);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Are you sure to submit this task ?',
      content: 'You can not change the answers after submit.',
      onOk: submitTaskCompleted,
    });
  };

  /**
   * Init variables
   */

  const annotationsList = Object.values(annotations) || [];

  const hasData = currentProject && Object.keys(currentProject).length;

  const dataLoading = projectLoading || !hasData;

  const isProjectAdmin = hasData && currentProject.current_users_role.is_project_admin;

  const isSubmitDisabled = Number(remaining) !== 0;
  const isFinished = annoList[0] && annoList[0].finished;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      reverseArrow
      breakpoint="xl"
      collapsedWidth="0"
      // onBreakpoint={broken => {
      //   console.log(broken);
      // }}
      width={320}
      className={className(styles.siderList, { [styles.dark]: dark })}
    >
      <Spin spinning={dataLoading} size="small">
        {hasData && (
          <section className={styles.info}>
            <div style={{ margin: '24px 24px 0' }}>
              <Descriptions title="Project Info" size="middle" column={1}>
                <Descriptions.Item label="Name">{currentProject.name}</Descriptions.Item>
                <Descriptions.Item label="Type">
                  {PROJECT_TYPE[currentProject.project_type].tag}
                </Descriptions.Item>
                {isProjectAdmin && (
                  <Descriptions.Item label="Settings">
                    <Link to={`/projects/${currentProject.id}/dashboard`}>Edit</Link>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          </section>
        )}
      </Spin>

      <section>
        <Spin spinning={taskLoading} size="small">
          <div className={styles.search}>
            {/* <Search size="large" placeholder="Search task" onSearch={handleOnSearch} /> */}
          </div>
          <div className={styles.about}>
            {`About ${pagination.total} tasks. (page ${page} of ${pageSize})`}
          </div>
          <Menu
            theme={dark ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[`${pageNumber}`]}
            onClick={({ key }) => {
              if (onChangeKey) onChangeKey(key);
            }}
          >
            <Menu.Divider />
            {list &&
              Object.keys(list).map((key, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Menu.Item key={index}>
                  <Row gutter={16} type="flex">
                    <Col span={2}>
                      {annotationsList[index] && annotationsList[index].length !== 0 && (
                        <Icon type="check" />
                      )}
                    </Col>
                    <Col span={22}>
                      <Typography.Paragraph ellipsis>{list[key].text}</Typography.Paragraph>
                    </Col>
                  </Row>
                </Menu.Item>
              ))}
            <div className={styles.buttonSubmit}>
              <Button
                icon="submit"
                type="primary"
                size="large"
                block
                onClick={showConfirm}
                disabled={isSubmitDisabled || isFinished}
              >
                {isFinished ? 'Finished' : 'Submit'}
              </Button>
            </div>
          </Menu>
        </Spin>
      </section>
    </Sider>
  );
});
export default SiderList;
