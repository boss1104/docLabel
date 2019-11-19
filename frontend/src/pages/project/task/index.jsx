/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, Dropdown, Form, Icon, Menu, Popconfirm, message } from 'antd';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { router } from 'umi';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './index.less';
import { PAGE_SIZE } from './constants';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const ProjectTask = connect(({ project, task, loading }) => ({
  project,
  task,
  loading: loading.models.task,
}))(props => {
  const {
    dispatch,
    project,
    task,
    loading,
    form,
    location: { query },
  } = props;
  const { currentProject } = project;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [formValues, setFormValues] = React.useState({});

  const taskTransform = React.useMemo(() => {
    const list = task.list ? Object.entries(task.list).map(([key, val]) => val) : [];
    return {
      ...task,
      list,
    };
  }, [task]);

  const fetchTask = async params => {
    try {
      await dispatch({
        type: 'task/fetch',
        payload: { params },
      });
    } catch (error) {
      message.error('Something wrong! Try agian');
    }
  };

  const fetchTaskDefault = async () => {
    await fetchTask({ offset: query.page ? (query.page - 1) * PAGE_SIZE : 0 });
  };

  const handleRemoveTask = async record => {
    try {
      await dispatch({
        type: 'task/remove',
        payload: {
          taskId: record.id,
        },
      });
      await fetchTaskDefault();
      message.success('Successfully deleted task!');
    } catch (error) {
      message.error('Something wrong! Try again');
    }
  };

  React.useEffect(() => {
    fetchTaskDefault();
  }, []);

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
        <React.Fragment>
          {/* <Divider type="vertical" /> */}
          <Popconfirm
            title="Are you sure delete this task?"
            onConfirm={() => handleRemoveTask(record)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
          </Popconfirm>
        </React.Fragment>
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
      offset: (pagination.current - 1) * PAGE_SIZE,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    fetchTask(params);
    router.push({
      query: pagination.current !== 1 ? { page: pagination.current } : {},
    });
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
            data={taskTransform}
            columns={columns}
            onSelectRow={handleSelectRows}
            onChange={handleStandardTableChange}
            defaultCurrent={Number(query.page)}
          />
        </div>
      </Card>
      <CreateForm
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        currentProject={currentProject}
        onAddCompleted={fetchTask}
      />
    </PageHeaderWrapper>
  );
});

export default Form.create()(ProjectTask);
