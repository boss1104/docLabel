import { Form, Icon, Modal, Typography, Radio, Table, Upload, Button, message, Spin } from 'antd';
import React from 'react';
import { connect } from 'dva';
import SyntaxHighlighter from 'react-syntax-highlighter';
// eslint-disable-next-line import/no-extraneous-dependencies
import uuid from 'uuid';
import { docco, darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import {
  TextClassificationProject,
  SequenceLabelingProject,
  Seq2seqProject,
  PdfLabelingProject,
} from './constants';
import { getAuthorization } from '@/utils/authority';

const PROJECT_TYPES = {
  TextClassificationProject,
  SequenceLabelingProject,
  Seq2seqProject,
  PdfLabelingProject,
};

const FormItem = Form.Item;

const ExcelBlock = ({ data }) => {
  const dataSource = data[0].data;
  const columns = [
    {
      title: '',
      render: (text, record, index) => index,
    },
    {
      title: 'A',
      dataIndex: '[0]',
    },
    {
      title: 'B',
      dataIndex: '[1]',
    },
    {
      title: 'C',
      dataIndex: '[2]',
    },
  ];
  return (
    <div style={{ padding: '8px', backgroundColor: '#2b2b2b' }}>
      <Table
        rowKey={record =>
          uuid.v4({
            name: record[0],
          })
        }
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
        size="small"
      />
    </div>
  );
};

function CreateForm({
  modalVisible,
  setModalVisible,
  form,
  currentProject,
  onAddCompleted,
  isDark,
}) {
  const [uploading, setUploading] = React.useState(false);
  const format = form.getFieldValue('format');
  const projectType = currentProject.project_type;
  const style = isDark ? darcula : docco;

  const uploadProps = {
    name: 'file',
    action: `/api/projects/${currentProject.id}/docs/upload/`,
    data: {
      format,
    },
    headers: {
      Authorization: `Token ${getAuthorization()}`,
    },
    onChange: async info => {
      if (info.file.status === 'uploading') {
        setUploading(true);
      }
      if (info.file.status === 'done') {
        // refresh
        await onAddCompleted();
        setUploading(false);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const getBlockCodeFormat = $format => {
    switch ($format) {
      case 'plain':
      case 'pdf':
      case 'csv':
        return (
          <SyntaxHighlighter language="plaintext" style={style}>
            {projectType ? PROJECT_TYPES[projectType][format].format : ''}
          </SyntaxHighlighter>
        );
      case 'json':
        return (
          <SyntaxHighlighter language="json" style={style}>
            {projectType ? PROJECT_TYPES[projectType][format].format : ''}
          </SyntaxHighlighter>
        );
      case 'excel':
        return <ExcelBlock data={projectType && PROJECT_TYPES[projectType][format].format} />;

      default:
        return null;
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 21 },
    },
  };

  return (
    <Modal
      destroyOnClose
      title="Add new Task"
      visible={modalVisible}
      footer={null}
      width={600}
      onCancel={() => setModalVisible(false)}
    >
      <Spin spinning={!!uploading}>
        <Form layout="horizontal" {...formItemLayout}>
          <Typography.Title level={4}></Typography.Title>
          <FormItem label="Format">
            {form.getFieldDecorator('format', {
              initialValue: 'json',
            })(
              <Radio.Group buttonStyle="solid">
                {projectType &&
                  Object.keys(PROJECT_TYPES[projectType]).map(key => (
                    <Radio.Button key={key} value={key}>
                      {PROJECT_TYPES[projectType][key].label}
                    </Radio.Button>
                  ))}
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem label="Sample">
            <div>{format && getBlockCodeFormat(format)}</div>
          </FormItem>
          <FormItem label="File">
            {form.getFieldDecorator('file', {
              valuePropName: 'file',
            })(
              <Upload {...uploadProps}>
                <Button>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>,
            )}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
}

export default Form.create()(
  connect(({ settings }) => ({
    isDark: settings.navTheme === 'dark',
  }))(CreateForm),
);
