import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Table, Divider, Popconfirm, Button, Form, Input } from 'antd';
import { randomColor } from '../../../utils';

const FormItem = Form.Item;

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
  public: stores.public,
}))
@Form.create()
class EntityCrudModal extends Component {
  constructor(props) {
    super(props);
    const { public: { roleLevel } = {} } = props;
    this.state = {
      visible: false,
      entityData: {},
    };
    this.columns = [
      {
        title: 'Entity ID',
        dataIndex: 'index',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Entity',
        dataIndex: 'text',
      },
      {
        title: 'color',
        dataIndex: 'color',
      },
      {
        title: 'bordercolor',
        dataIndex: 'bordercolor',
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
            <Popconfirm title="Confirm delete?" onConfirm={() => this.handleDelete(record.labelId)}>
              <a>Delete</a>
            </Popconfirm>
          </span>
        ),
      });
    }
  }

  handleDelete = labelId => {
    const { dispatch, manualAnnotationDetail: { projectId } = {} } = this.props;
    dispatch({
      type: 'manualAnnotationDetail/deleteLabel',
      payload: labelId,
    }).then(errCode => {
      if (!errCode) {
        // Get the list of entity sets
        dispatch({
          type: 'manualAnnotationDetail/queryLabelsList',
          payload: projectId,
        });
      }
    });
  };

  handleUpdate = record => {
    this.setState({
      visible: true,
      entityData: record,
    });
  };

  render() {
    const {
      dispatch,
      visible,
      onCancel,
      manualAnnotationDetail: { labelCategories = [], projectId } = {},
      public: { roleLevel } = {},
      form: { getFieldDecorator, validateFields },
    } = this.props;
    const formItemLayout = {
      // Raster row configuration of the form
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
      <Modal title="Edit entity set" visible={visible} onOk={onCancel} onCancel={onCancel}>
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
          dataSource={labelCategories}
          rowKey={record => record.labelId}
        />
        <Modal
          title={this.state.entityData && this.state.entityData.labelId ? '编辑实体' : '新增实体'}
          visible={this.state.visible}
          onOk={() => {
            validateFields((errors, values) => {
              if (errors) {
                return;
              }
              if (this.state.entityData && this.state.entityData.labelId) {
                // Edit
                dispatch({
                  type: 'manualAnnotationDetail/updateLabel',
                  payload: {
                    labelId: this.state.entityData.labelId,
                    text: values.text,
                    color: values.color,
                    bordercolor: values.bordercolor,
                  },
                }).then(errCode => {
                  if (!errCode) {
                    // Get the list of entity sets
                    dispatch({
                      type: 'manualAnnotationDetail/queryLabelsList',
                      payload: projectId,
                    });
                  }
                });
              } else {
                // New
                dispatch({
                  type: 'manualAnnotationDetail/addLabel',
                  payload: {
                    projectId,
                    label: {
                      text: values.text,
                      color: randomColor(),
                      bordercolor: randomColor(),
                    },
                  },
                }).then(errCode => {
                  if (!errCode) {
                    // Get the list of entity sets
                    dispatch({
                      type: 'manualAnnotationDetail/queryLabelsList',
                      payload: projectId,
                    });
                  }
                });
              }
              this.setState({ visible: false, entityData: {} });
            });
          }}
          onCancel={() => {
            this.setState({ visible: false, entityData: {} });
          }}
          destroyOnClose
        >
          <FormItem label="Entity name" {...formItemLayout}>
            {getFieldDecorator('text', {
              rules: [{ required: true, message: 'Entity name cannot be empty!' }],
              initialValue: this.state.entityData && this.state.entityData.text,
            })(<Input />)}
          </FormItem>
          {this.state.entityData && this.state.entityData.labelId && (
            <React.Fragment>
              <FormItem label="color" {...formItemLayout}>
                {getFieldDecorator('color', {
                  rules: [{ required: true, message: 'Color cannot be empty!' }],
                  initialValue: this.state.entityData && this.state.entityData.color,
                })(<Input />)}
              </FormItem>
              <FormItem label="bordercolor" {...formItemLayout}>
                {getFieldDecorator('bordercolor', {
                  rules: [{ required: true, message: 'Bordercolor cannot be empty!' }],
                  initialValue: this.state.entityData && this.state.entityData.bordercolor,
                })(<Input />)}
              </FormItem>
            </React.Fragment>
          )}
        </Modal>
      </Modal>
    );
  }
}

export default EntityCrudModal;
