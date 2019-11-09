import React from 'react';
import { Button, Menu, Icon, Layout, Input, Spin } from 'antd';
import { connect } from 'dva';

const { Sider } = Layout;
const { Search } = Input;

const SiderList = connect(({ project, task, loading }) => ({
  project,
  task,
  projectLoading: loading.effects['project/fetchProject'],
  taskLoading: loading.effects['task/fetch'],
}))(props => {
  const {
    project: { currentProject },
    task: { list, pagination },
    projectLoading,
    taskLoading,
    // Parent props
    onChangeKey,
    selectedKeys,
    pageSize,
    page,
  } = props;
  // console.log('SiderList render');

  /**
   * Handle Function
   */
  const handleOnSearch = value => {
    console.log('TCL: value', value);
  };

  return (
    <Sider
      // collapsible
      // collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
      width={400}
    >
      <Spin spinning={projectLoading} size="small">
        <section>
          <h3>
            Project Info
            <Button type="primary" onClick={() => {}}>
              Go to project setting (If project admin)
            </Button>
          </h3>
          <div>
            <div>Project name</div>
            {currentProject.name}
          </div>
        </section>
      </Spin>

      <Spin spinning={taskLoading} size="small">
        <section>
          <div style={{ padding: '16px' }}>
            <Search size="large" placeholder="Search task" onSearch={handleOnSearch} />
          </div>
          <div style={{ textAlign: 'center' }}>
            {`About ${pagination.total} tasks. (page ${page} of ${pageSize})`}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            onClick={({ key }) => {
              if (onChangeKey) onChangeKey(key);
            }}
          >
            <Menu.Divider />
            {list &&
              Object.keys(list).map(key => (
                <Menu.Item key={key}>
                  <Icon type="check" />
                  <span>{list[key].text.slice(0, 60)}</span>
                </Menu.Item>
              ))}
          </Menu>
        </section>
      </Spin>
    </Sider>
  );
});
export default SiderList;
