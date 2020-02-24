import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Card, Divider, Table, Popconfirm, Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import styles from './index.less';
import CreateForm from './components/CreateForm';
import { PROJECT_TYPE } from '@/pages/constants';

// TODO: make color random

function LabelPage({ dispatch, updateLoading, createLoading, loading, label, currentProject }) {
  const { list: dataSource } = label;
  const projectId = currentProject.id;
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
      render: (text, record) => (
        <Button style={{ backgroundColor: text, color: record.text_color }}>{record.text}</Button>
      ),
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
  const dataSourceTranform = React.useMemo(() => {
    const list = dataSource ? Object.entries(dataSource).map(([key, val]) => val) : [];
    return list;
  }, [dataSource]);

  const isShow = currentProject.project_type !== 'Seq2seqProject';
  return (
    <PageHeaderWrapper
      content={
        <React.Fragment>
          {isShow && (
            <Button icon={<PlusOutlined />} type="primary" onClick={() => setModalVisible(true)}>
              Add label
            </Button>
          )}
          {!isShow && (
            <Typography.Text type="warning" style={{ fontSize: '16px' }}>
              {currentProject.project_type && PROJECT_TYPE[currentProject.project_type].label}{' '}
              project does not use labels for annotation !
            </Typography.Text>
          )}
        </React.Fragment>
      }
    >
      {isShow && (
        <React.Fragment>
          <Card bordered={false}>
            <div className={styles.tableList}></div>
            <Table
              rowKey={record => record.id}
              loading={loading}
              dataSource={dataSourceTranform}
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
        </React.Fragment>
      )}
    </PageHeaderWrapper>
  );
}

export default connect(({ project, label, loading }) => ({
  currentProject: project.currentProject,
  label,
  loading: loading.effects['label/fetch'],
  createLoading: loading.effects['label/add'],
  updateLoading: loading.effects['label/update'],
}))(LabelPage);
