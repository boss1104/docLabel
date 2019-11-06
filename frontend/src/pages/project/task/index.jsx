import { Button, Card, Divider, Dropdown, Form, Icon, Menu, Popconfirm, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './index.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
export default connect(({ project, task, loading }) => ({
  project,
  task,
  loading: loading.models.task,
}))(
  Form.create()(props => {
    const {
      project,
      task: { data },
      loading,
      form,
      dispatch,
    } = props;
    const { currentProject } = project;
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [formValues, setFormValues] = React.useState({});

    const fetchTask = filters => {
      dispatch({
        type: 'task/fetch',
        payload: {
          projectId: currentProject.id,
          params: filters,
        },
      });
    };

    React.useEffect(() => {
      if (currentProject.id) fetchTask();
    }, [currentProject.id]);

    const handleRemoveTask = record => {
      dispatch({
        type: 'task/remove',
        payload: {
          projectId: currentProject.id,
          task: record.id,
        },
        callback: errors => {
          if (errors) {
            message.error('Something wrong!');
          } else {
            message.success('Deleted successfully!');
            fetchTask();
          }
        },
      });
    };

    const columns = [
      {
        title: '#',
        dataIndex: 'id',
      },
      {
        title: 'Text',
        dataIndex: 'text',
      },
      // {
      //   title: 'Annotation approver',
      //   dataIndex: 'annotation_approver',
      //   render: (text, record) => {},
      // },
      {
        title: 'Operation',
        render: (text, record) => (
          <Fragment>
            {/* <Divider type="vertical" /> */}
            <Popconfirm
              title="Are you sure delete this label?"
              onConfirm={() => handleRemoveTask(record)}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const handleStandardTableChange = (pagination, filtersArg, sorter) => {
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});
      const params = {
        page: pagination.current,
        // pageSize: pagination.pageSize,
        ...formValues,
        ...filters,
      };

      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
      }

      fetchTask(params);
    };

    const handleFormReset = () => {
      form.resetFields();
      setFormValues({});
      fetchTask();
    };

    // const toggleForm = () => {
    //   const { expandForm } = this.state;
    //   this.setState({
    //     expandForm: !expandForm,
    //   });
    // };

    const handleMenuClick = e => {
      if (!selectedRows) return;

      switch (e.key) {
        case 'remove':
          // TODO: Api not support yet ?
          // dispatch({
          //   type: 'task/remove',
          //   payload: {
          //     key: selectedRows.map(row => row.key),
          //   },
          //   callback: () => {
          //     setSelectedRows([]);
          //   },
          // });
          break;

        default:
          break;
      }
    };

    const handleSelectRows = rows => {
      setSelectedRows(rows);
    };

    const handleSearch = e => {
      e.preventDefault();
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const values = {
          ...fieldsValue,
          updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        };
        setFormValues(values);
        fetchTask(values);
      });
    };

    const menu = (
      <Menu onClick={handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">Delete</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper
        content={
          <Button icon="plus" type="primary" onClick={() => setModalVisible(true)}>
            Add task
          </Button>
        }
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      More operations <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              rowKey={record => record.id}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={handleSelectRows}
              onChange={handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          currentProject={currentProject}
        />
      </PageHeaderWrapper>
    );
  }),
);
