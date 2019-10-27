import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Divider, Popconfirm, Button, Form, Input } from 'antd';

const FormItem = Form.Item;

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
  public: stores.public,
}))
@Form.create()
class ConnectionCrudModal extends Component {
  constructor(props) {
    super(props);
    const { public: { roleLevel } = {} } = props;
    this.state = {
      visible: false,
      connectionData: {},
    };
    this.columns = [
      {
        title: 'Connection ID',
        dataIndex: 'index',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Relationship',
        dataIndex: 'text',
      },
    ];
    if (roleLevel >= 3) {
      this.columns.push({
        title: 'Operating',
        key: 'action',
        width: 120,
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleUpdate(record)}>Edit</a>
            <Divider type="vertical" />
            <Popconfirm
              title="Confirm deletion?"
              onConfirm={() => this.handleDelete(record.connectionId)}
            >
              <a>Delete</a>
            </Popconfirm>
          </span>
        ),
      });
    }
  }

  handleDelete = connectionId => {
    const { dispatch, manualAnnotationDetail: { projectId } = {} } = this.props;
    dispatch({
      type: 'manualAnnotationDetail/deleteConnection',
      payload: connectionId,
    }).then(errCode => {
      if (!errCode) {
        // Get a list of relationship sets
        dispatch({
          type: 'manualAnnotationDetail/queryConnectionsList',
          payload: projectId,
        });
      }
    });
  };

  handleUpdate = record => {
    this.setState({
      visible: true,
      connectionData: record,
    });
  };

  render() {
    const {
      dispatch,
      visible,
      onCancel,
      manualAnnotationDetail: { connectionCategories = [], projectId } = {},
      public: { roleLevel } = {},
      form: { getFieldDecorator, validateFields },
    } = this.props;
    const formItemLayout = {
      // Add a grid row configuration for the form
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <Modal title="Edit relationship set" visible={visible} onOk={onCancel} onCancel={onCancel}>
        {roleLevel >= 3 && (
          <Button
            type="primary"
            onClick={() => {
              this.setState({ visible: true });
            }}
          >
            New
          </Button>
        )}
        <Table
          columns={this.columns}
          dataSource={connectionCategories}
          rowKey={record => record.connectionId}
        />
        <Modal
          title={
            this.state.connectionData && this.state.connectionData.connectionId
              ? 'Editing relationship'
              : 'New relationship'
          }
          visible={this.state.visible}
          onOk={() => {
            validateFields((errors, values) => {
              if (errors) {
                return;
              }
              if (this.state.connectionData && this.state.connectionData.connectionId) {
                // Edit
                dispatch({
                  type: 'manualAnnotationDetail/updateConnection',
                  payload: {
                    connectionId: this.state.connectionData.connectionId,
                    text: values.text,
                  },
                }).then(errCode => {
                  if (!errCode) {
                    // Get a list of relationship sets
                    dispatch({
                      type: 'manualAnnotationDetail/queryConnectionsList',
                      payload: projectId,
                    });
                  }
                });
              } else {
                // New
                dispatch({
                  type: 'manualAnnotationDetail/addConnection',
                  payload: {
                    projectId,
                    connection: {
                      text: values.text,
                    },
                  },
                }).then(errCode => {
                  if (!errCode) {
                    // Get a list of relationship sets
                    dispatch({
                      type: 'manualAnnotationDetail/queryConnectionsList',
                      payload: projectId,
                    });
                  }
                });
              }
              this.setState({ visible: false, connectionData: {} });
            });
          }}
          onCancel={() => {
            this.setState({ visible: false, connectionData: {} });
          }}
          destroyOnClose
        >
          <FormItem label="Relationship name" {...formItemLayout}>
            {getFieldDecorator('text', {
              rules: [{ required: true, message: 'The relationship name cannot be empty!' }],
              initialValue: this.state.connectionData && this.state.connectionData.text,
            })(<Input />)}
          </FormItem>
        </Modal>
      </Modal>
    );
  }
}

export default ConnectionCrudModal;
