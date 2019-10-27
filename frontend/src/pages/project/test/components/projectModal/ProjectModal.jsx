import React, { Component } from 'react';
import { connect } from 'dva';
import { Upload, Modal, Button, Icon, message, Table } from 'antd';

// connect then pass data to props
@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
  public: stores.public,
}))
class ProjectModal extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Project ID',
        dataIndex: 'projectId',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'File name',
        dataIndex: 'name',
      },
      {
        title: 'Action',
        key: 'action',
        width: 120,
        render: (text, record) => (
          <span>
            <a
              onClick={async () => {
                // Process multiple asynchronous results in parallel:
                // get a list of entity sets, get a list of relation sets
                await Promise.all([
                  props.dispatch({
                    type: 'manualAnnotationDetail/queryLabelsList',
                    payload: record.projectId,
                  }),
                  props.dispatch({
                    type: 'manualAnnotationDetail/queryConnectionsList',
                    payload: record.projectId,
                  }),
                ]);
                props.dispatch({
                  type: 'manualAnnotationDetail/saveProjectInfo',
                  payload: { projectId: record.projectId, name: record.name },
                });
                props
                  .dispatch({
                    type: 'manualAnnotationDetail/querySentencesList',
                    payload: record.projectId,
                  })
                  .then(res => {
                    props.annotationInit(res.find(item => !item.labeled));
                  });
                props.onCancel();
              }}
            >
              Select
            </a>
          </span>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'manualAnnotationDetail/queryProjectsList' });
  }

  render() {
    const {
      visible,
      onCancel,
      manualAnnotationDetail: { projectsList = [] } = {},
      public: { roleLevel } = {},
      dispatch,
    } = this.props;
    const props = {
      name: 'file',
      action: '/api/manual/upload',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} Successfully imported`);
          dispatch({ type: 'manualAnnotationDetail/queryProjectsList' });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} Import failed`);
        }
      },
    };
    return (
      <Modal title="Select item" visible={visible} onOk={onCancel} onCancel={onCancel}>
        {roleLevel >= 2 && (
          <Upload {...props}>
            <Button>
              <Icon type="upload" />
              Upload files
            </Button>
          </Upload>
        )}
        <Table
          columns={this.columns}
          dataSource={projectsList}
          rowKey={record => record.projectId}
        />
      </Modal>
    );
  }
}

export default ProjectModal;
