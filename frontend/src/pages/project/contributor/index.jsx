import React from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Dropdown, Icon, Menu, Popconfirm, Tag, message } from 'antd';
import styles from './index.less';
import StandardTable from './components/StandardTable';
import CreateForm from './components/CreateForm';
import UserRequestList from './components/UserRequestList';
import { ROLE_COLORS, ROLE_LABELS } from '@/pages/constants';

const getOtherUsers = (allUsers, roleMappings) => {
  const currentUserIds = new Set(roleMappings.map(roleMapping => roleMapping.user));
  return allUsers.filter(user => !currentUserIds.has(user.id));
};

function Contributor({ dispatch, contributor, loading, currentProject }) {
  const { roles, users, projectRoles, notifications } = contributor;
  // States
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [otherUsers, setOtherUsers] = React.useState([]);

  // Effects
  const fetchData = async () => {
    try {
      // eslint-disable-next-line no-shadow
      const { projectRoles, users, roles } = await dispatch({
        type: 'contributor/fetchContributor',
      });
      setOtherUsers(getOtherUsers(users, projectRoles));
    } catch (error) {
      console.log('[DEBUG]: fetchData -> error', error.data);
      message.error('Something wrong! Please try again!');
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Handler
  const handleMenuClick = () => {};
  const handleSelectRows = () => {};
  const handleStandardTableChange = () => {};

  const removeRoleMapping = async role => {
    try {
      await dispatch({
        type: 'contributor/deleteRole',
        payload: role.id,
      });
      message.success('Successfully removed user');
    } catch (error) {
      message.error('Something wrong! Try Again');
    }
  };

  const switchRole = async (userId, newRoleId) => {
    const currentRole = projectRoles.find(role => role.user === userId);

    try {
      await dispatch({
        type: 'contributor/switchRole',
        payload: {
          roleId: currentRole.id,
          data: {
            role: newRoleId,
          },
        },
      });
      message.success('Successfully changed role');
    } catch (error) {
      console.log('[DEBUG]: switchRole -> error', error.data);
      message.error(error.data.non_field_errors);
    }
  };

  // Variables
  const getOtherRoles = currentRoleID => {
    let others = [];
    if (Array.isArray(roles)) {
      others = roles.filter(role => role.id !== currentRoleID);
    }
    return others;
  };

  const markAsReadNotification = async id => {
    await dispatch({
      type: 'contributor/markAsReadNotification',
      payload: id,
    });
  };

  const handleReject = ({ id }) => {
    console.log('[DEBUG]: handleReject -> id', id);
    markAsReadNotification(id);
    // mark noti as read
  };
  const handleResolve = async ({ id, actor, action_object: role }) => {
    // mark noti as read and add role for user
    try {
      await markAsReadNotification(id);
      await dispatch({
        type: 'contributor/addRole',
        payload: {
          user: actor.id,
          role: role.id,
        },
      });
      message.success('Successfully add user to project');
    } catch (error) {
      const { data } = error;
      message.error('Something wrong! Try again!');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'User Name',
      dataIndex: 'username',
    },
    {
      title: 'Role',
      dataIndex: 'rolename',
      render: (text, record) => {
        const others = getOtherRoles(record.role);
        const menu = (
          <Menu>
            {others.length !== 0 &&
              others.map(item => (
                <Menu.Item key={item.id} onClick={() => switchRole(record.user, item.id)}>
                  <Tag color={ROLE_COLORS[item.id]}>{ROLE_LABELS[item.name]}</Tag>
                </Menu.Item>
              ))}
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <a href="#">
              <Tag color={ROLE_COLORS[record.role]}>{ROLE_LABELS[record.rolename]}</Tag>
              <Icon type="down" />
            </a>
          </Dropdown>
        );
      },
    },
    {
      title: 'Operation',
      render: (text, record) => (
        <React.Fragment>
          <Popconfirm
            title="Are you sure remove user ?"
            onConfirm={() => removeRoleMapping(record)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
          </Popconfirm>
        </React.Fragment>
      ),
    },
  ];

  return (
    <PageHeaderWrapper
      content={
        <Button icon="plus" type="primary" onClick={() => setModalVisible(true)}>
          Add Existing User
        </Button>
      }
    >
      <Card bordered={false}>
        <div className={styles.tableList}>
          {/* <div className={styles.tableListForm}>{renderForm()}</div> */}
          <div className={styles.tableListOperator}>
            {selectedRows.length > 0 && (
              <span>
                <Dropdown
                  overlay={
                    <Menu onClick={handleMenuClick} selectedKeys={[]}>
                      <Menu.Item key="remove">Delete</Menu.Item>
                    </Menu>
                  }
                >
                  {/* <Button>
                    More operations <Icon type="down" />
                  </Button> */}
                </Dropdown>
              </span>
            )}
          </div>
          <StandardTable
            rowKey={record => record.id}
            selectedRows={selectedRows}
            loading={loading}
            data={{ list: projectRoles, pagination: null }}
            columns={columns}
            onSelectRow={handleSelectRows}
            onChange={handleStandardTableChange}
          />
        </div>
      </Card>

      <CreateForm
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        otherUsers={otherUsers}
        roles={roles}
      />

      <UserRequestList
        list={notifications}
        onResolve={handleResolve}
        onReject={handleReject}
        loading={loading}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ contributor, loading, project }) => ({
  contributor,
  loading: loading.models.contributor,
  currentProject: project.currentProject,
}))(Contributor);
