import React from 'react';
import { Button, Modal, Input, Typography, message, Spin } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import ProjectInfoForm from './components/ProjectInfoForm';
import TaskSettings from './components/TaskSettings';

const Setting = connect(({ loading, project }) => ({
  currentProject: project.currentProject,
  loading: loading.effects['project/fetchProject'],
}))(props => {
  const { dispatch, currentProject, loading } = props;

  const inputRef = React.useRef(null);

  const confirmDelete = () => {
    Modal.confirm({
      okText: 'Delete',
      title: 'Confirm delete ?',
      content: (
        <>
          <Typography.Paragraph>
            Do you want to delete project{' '}
            <Typography.Text code>{currentProject.name}</Typography.Text> ?
            <div
              style={{
                fontStyle: 'italic',
              }}
            >
              Please enter the project name to confirm delete this project.
            </div>
          </Typography.Paragraph>
          <Input ref={inputRef} />
        </>
      ),
      onOk() {
        const nameVal = inputRef.current.state.value;

        if (nameVal === currentProject.name) {
          dispatch({
            type: 'setting/deleteProject',
            payload: currentProject.id,
          });
        } else {
          message.error('Wrong project name');
        }
      },
      okButtonProps: {
        type: 'danger',
      },
      onCancel() {},
      centered: true,
    });
  };

  return (
    <PageHeaderWrapper>
      <div className={styles.main}>
        <Spin spinning={loading}></Spin>
        {!loading && (
          <>
            <ProjectInfoForm />
            <TaskSettings />
            <div>Contribution settings</div>
            <div className={styles.deletebutton}>
              <Button type="danger" block onClick={confirmDelete}>
                Delete project
              </Button>
            </div>
          </>
        )}
      </div>
    </PageHeaderWrapper>
  );
});

export default Setting;
