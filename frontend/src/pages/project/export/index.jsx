import { Button, Form, Icon, Modal, Radio, Spin } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './index.less';

const CodeBlock = ({ language, value }) => (
  <SyntaxHighlighter language={language} style={darcula}>
    {value}
  </SyntaxHighlighter>
);

const FormItem = Form.Item;

const Extract = props => {
  const { dispatch, loading, currentProject } = props;

  const [format, setFormat] = useState('json');
  const [modalVisible, setModalVisible] = useState(false);

  const handleDownload = async () => {
    try {
      const res = await dispatch({
        type: 'extract/download',
        payload: format,
      });
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${currentProject.name}.${format === 'json' ? 'jsonl' : format}`,
      );
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log('[DEBUG]: handleDownload -> err', err);
    }
  };
  return (
    <div className={styles.main}>
      <Button onClick={() => setModalVisible(true)}>Download</Button>
      <Modal
        destroyOnClose
        title="Download Annotation Data"
        visible={modalVisible}
        footer={null}
        width={600}
        onCancel={() => setModalVisible(false)}
      >
        <Spin spinning={!!loading}>
          <Form layout="horizontal">
            <FormItem
              labelCol={{
                span: 3,
              }}
              wrapperCol={{
                span: 17,
              }}
              label="Format"
            >
              <Radio.Group
                buttonStyle="solid"
                value={format}
                onChange={e => setFormat(e.target.value)}
              >
                <Radio.Button value="json">JSON</Radio.Button>
                <Radio.Button value="csv">CSV</Radio.Button>
              </Radio.Group>
            </FormItem>
            <div style={{ margin: '24px 0' }}>
              {format && <CodeBlock value={format} language={format} />}
            </div>
            <FormItem
              wrapperCol={{
                span: 17,
                offset: 3,
              }}
            >
              <Button type="primary" onClick={handleDownload}>
                <Icon type="download" /> Download
              </Button>
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default connect(({ project, loading }) => ({
  currentProject: project.currentProject,
  loading: loading.models.extract,
}))(Extract);
