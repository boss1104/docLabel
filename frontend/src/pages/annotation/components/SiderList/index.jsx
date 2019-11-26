import React from 'react';
import { Menu, Icon, Layout, Input, Spin, Row, Col, Typography, Descriptions } from 'antd';
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
  } = props;
  console.log('[DEBUG]: dark', dark);
  const [collapsed, setCollapsed] = React.useState(false);

  const annoList = Object.values(annotations) || [];
  /**
   * Handle Function
   */
  const handleOnSearch = value => {
    console.log('TCL: value', value);
  };

  /**
   * Init variables
   */

  const hasData = currentProject && Object.keys(currentProject).length;

  const dataLoading = projectLoading || !hasData;

  const isProjectAdmin = hasData && currentProject.current_users_role.is_project_admin;

  const onCollapse = (newCollapsed, type) => {
    console.log('[DEBUG]: onCollapse -> type', type);
    setCollapsed(newCollapsed);
  };

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

      <Spin spinning={taskLoading} size="small">
        <section>
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
                      {annoList[index] && annoList[index].length !== 0 && <Icon type="check" />}
                    </Col>
                    <Col span={22}>
                      <Typography.Paragraph ellipsis>{list[key].text}</Typography.Paragraph>
                    </Col>
                  </Row>
                </Menu.Item>
              ))}
          </Menu>
        </section>
      </Spin>
    </Sider>
  );
});
export default SiderList;
