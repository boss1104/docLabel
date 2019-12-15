import { Button, Form, Icon, Modal, Radio, Spin, Card, Popconfirm, Select } from 'antd';
import { connect } from 'dva';
import React, { useState, useEffect, useMemo } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import StandardTable from './components/StandardTable';

const CodeBlock = ({ language, value }) => (
  <SyntaxHighlighter language={language} style={darcula}>
    {value}
  </SyntaxHighlighter>
);

const FormItem = Form.Item;
const { Option } = Select;

const Extract = ({ dispatch, loading, currentProject, location: { query } }) => {
  // Form Data
  const [format, setFormat] = useState('json');
  const [userId, setUserId] = useState(null); // all users
  //
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleDownload = async () => {
    try {
      const payload = userId ? { format, userId } : { format };
      const res = await dispatch({
        type: 'extract/download',
        payload,
      });
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${currentProject.name}-${userId ? `${userId}` : 'all'}.${
          format === 'json' ? 'jsonl' : format
        }`,
      );
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log('[DEBUG]: handleDownload -> err', err);
    }
  };
  const fetchTasks = async () => {
    try {
      const params = {};
      const data = {};
      const res = await dispatch({
        type: 'task/fetch',
        payload: { params, data },
      });
      console.log('[DEBUG]: fetchTasks -> res', res);
    } catch (err) {
      console.log('[DEBUG]: fetchTasks -> err', err);
    }
  };
  useEffect(() => {
    //  effect
    fetchTasks();
    return () => {
      //  cleanup
    };
  }, []);

  // useEffect(() => {
  //   if (currentProject && currentProject.id) {
  //     setUserId(currentProject.users[0]);
  //   }
  //   return () => {};
  // }, [currentProject]);

  const handleRemoveTask = () => {};

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
    },
    {
      title: 'Text',
      dataIndex: 'text',
    },
    {
      title: 'Contributor',
      render: () => <div>Contributor</div>,
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

  const handleStandardTableChange = () => {};

  const taskTransform = () => {};

  const handleSelectRows = () => {};

  const hasData =
    currentProject && Array.isArray(currentProject.users) && currentProject.users.length > 0;

  return (
    <div className={styles.main}>
      <PageHeaderWrapper
        title="Export data"
        content={
          <Button icon="download" type="primary" onClick={() => setModalVisible(true)}>
            Download
          </Button>
        }
      >
        <Card bordered={false} title="Feature export individual task data: TODO">
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              {/* {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      More operations <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
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
              <FormItem
                labelCol={{
                  span: 3,
                }}
                wrapperCol={{
                  span: 17,
                }}
                label="User"
              >
                <Select
                  defaultValue={null}
                  style={{ width: 130 }}
                  onChange={value => {
                    setUserId(value);
                  }}
                >
                  <Option value={null}>All</Option>
                  {hasData &&
                    currentProject.users.map(({ id, username }) => (
                      <Option key={id} value={id}>
                        {username}
                      </Option>
                    ))}
                </Select>
              </FormItem>
              {/* <div style={{ margin: '24px 0' }}>
                {format && <CodeBlock value={format} language={format} />}
              </div> */}
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
      </PageHeaderWrapper>
    </div>
  );
};

export default connect(({ project, loading }) => ({
  currentProject: project.currentProject,
  loading: loading.models.extract,
}))(Extract);
