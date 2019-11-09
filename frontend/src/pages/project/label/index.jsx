import React from 'react';
import { Button, message, Card, Divider, Table, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import styles from './index.less';
import CreateForm from './components/CreateForm';

// TODO: make color random

export default connect(({ project, label, loading }) => ({
  project,
  label,
  loading: loading.effects['label/fetch'],
  createLoading: loading.effects['label/add'],
  updateLoading: loading.effects['label/update'],
}))(props => {
  // Props
  const { dispatch, updateLoading, createLoading, loading, label, project } = props;
  const { list: dataSource } = label;
  const projectId = project.currentProject.id;
  // States
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = React.useState(false);
  const formRef = React.useRef(null);
  // Effects
  React.useEffect(() => {
    dispatch({
      type: 'label/fetch',
    });
  }, []);

  // Functions
  const callBackFormError = errors => {
    if (errors) {
      const [key, errorMsg] = errors.non_field_errors[0].split(':');
      console.log(key, errorMsg);
      formRef.current.setFields({
        [key]: {
          value: formRef.current.getFieldValue(key),
          errors: [new Error(errorMsg)],
        },
      });
      message.error('Something wrong!');
    } else {
      message.success('Label added successfully!');
      dispatch({
        type: 'label/fetch',
        payload: projectId,
      });
    }
  };

  const handleAddLabel = values => {
    dispatch({
      type: 'label/add',
      payload: {
        projectId,
        data: values,
      },
      callback: callBackFormError,
    });
  };

  const handleUpdateLabel = values => {
    console.log('TCL: values', values);
    dispatch({
      type: 'label/update',
      payload: {
        projectId,
        labelId: values.id,
        data: values,
      },
      callback: errors => {
        if (errors) {
          const [key, errorMsg] = errors.non_field_errors[0].split(':');
          console.log(key, errorMsg);
          formRef.current.setFields({
            [key]: {
              value: formRef.current.getFieldValue(key),
              errors: [new Error(errorMsg)],
            },
          });
          message.error('Something wrong!');
        } else {
          message.success('Updated successfully!');
          dispatch({
            type: 'label/fetch',
            payload: projectId,
          });
        }
      },
    });
  };

  const handleRemoveLabel = record => {
    dispatch({
      type: 'label/remove',
      payload: {
        projectId,
        labelId: record.id,
      },
      callback: errors => {
        if (errors) {
          message.error('Something wrong!');
        } else {
          message.success('Deleted successfully!');
          dispatch({
            type: 'label/fetch',
            payload: projectId,
          });
        }
      },
    });
  };

  const handleUpdateModalVisible = record => {
    setModalUpdateVisible(true);
    formRef.current.setFieldsValue({
      ...record,
    });
  };

  // Variables
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
    },
    {
      title: 'Text',
      dataIndex: 'text',
      // mark to display a total number
      // needTotal: true,
    },
    {
      title: 'Prefix',
      dataIndex: 'prefix_key',
      align: 'right',
      render: text => text && text.toUpperCase(),
    },
    {
      title: 'Key',
      dataIndex: 'suffix_key',
      render: text => text.toUpperCase(),
    },
    {
      title: 'Preview',
      dataIndex: 'background_color',
      render: (text, record) => <Button style={{ backgroundColor: text }}>{record.text}</Button>,
    },
    // {
    //   title: 'text_color',
    //   dataIndex: 'text_color',
    // },
    {
      title: 'Operation',
      render: (text, record) => (
        <React.Fragment>
          <a onClick={() => handleUpdateModalVisible(record)}>Update</a>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure delete this label?"
            onConfirm={() => handleRemoveLabel(record)}
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
          Add label
        </Button>
      }
    >
      <Card bordered={false}>
        <div className={styles.tableList}></div>
        <Table
          rowKey={record => record.id}
          loading={loading}
          dataSource={dataSource}
          columns={columns}
        />
      </Card>
      <CreateForm
        onCreate={form => {
          formRef.current = form;
        }}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        loading={createLoading}
        handleSubmit={handleAddLabel}
      />
      <CreateForm
        onCreate={form => {
          formRef.current = form;
        }}
        modalVisible={modalUpdateVisible}
        setModalVisible={setModalUpdateVisible}
        loading={updateLoading}
        handleSubmit={handleUpdateLabel}
      />
    </PageHeaderWrapper>
  );
});
