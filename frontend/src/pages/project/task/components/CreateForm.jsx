import { Form, Icon, Modal, Typography, Radio, Table, Upload, Button, message } from 'antd';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import uuid from 'uuid';
// eslint-disable-next-line import/no-unresolved
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { TextClassificationProject, SequenceLabelingProject, Seq2seqProject } from './constants';

const PROJECT_TYPES = {
  TextClassificationProject,
  SequenceLabelingProject,
  Seq2seqProject,
};

const FormItem = Form.Item;

const CodeBlock = ({ language, value }) => (
  <SyntaxHighlighter language={language} style={darcula}>
    {value}
  </SyntaxHighlighter>
);

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

const CreateForm = props => {
  const { modalVisible, setModalVisible, form, currentProject } = props;

  const uploadProps = {
    name: 'file',
    action: `/api/projects/${currentProject.id}/docs/upload/`,
    data: {
      format: form.getFieldValue('format'),
    },
    headers: {
      Authorization: `Token ${localStorage.getItem('antd-pro-authority')}`,
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const format = form.getFieldValue('format');
  const projectType = currentProject.project_type;

  return (
    <Modal
      destroyOnClose
      title="New Task"
      visible={modalVisible}
      footer={null}
      width={600}
      onCancel={() => setModalVisible(false)}
    >
      <Form layout="horizontal">
        <Typography.Title level={4}>Upload a file to annotate text.</Typography.Title>
        <FormItem
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 17,
          }}
          label="Format: "
        >
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
        <div style={{ margin: '24px 0' }}>
          {format &&
            (format === 'excel' ? (
              <ExcelBlock data={projectType && PROJECT_TYPES[projectType][format].format} />
            ) : (
              <CodeBlock
                value={projectType ? PROJECT_TYPES[projectType][format].format : ''}
                language={format}
              />
            ))}
        </div>
        <FormItem
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 17,
          }}
          label="File"
        >
          {form.getFieldDecorator('file', {
            valuePropName: 'file',
            // getValueFromEvent: e => {
            //   console.log('Upload event:', e);
            //   if (Array.isArray(e)) {
            //     return e;
            //   }
            //   return e && e.fileList;
            // },
          })(
            <Upload {...uploadProps}>
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>,
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create()(CreateForm);
