import React from 'react';
import { Button, Modal, Input, Typography, message, Spin } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import ProjectInfoForm from './components/ProjectInfoForm';

const Setting = props => {
  const {
    dispatch,
    project: { currentProject },
    loading,
    loadingUpdateProject,
    setting: { status, errors },
  } = props;
  console.log('TCL: loadingUpdateProject', loadingUpdateProject);

  const inputRef = React.useRef(null);

  const confirmDelete = () => {
    Modal.confirm({
      okText: 'Delete',
      title: 'Confirm delete !',
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
          message.error('Wrong project name !');
        }
      },
      okButtonProps: {
        type: 'danger',
      },
      onCancel() {},
    });
  };

  const handleSubmit = values => {
    dispatch({
      type: 'setting/updateProject',
      payload: {
        id: currentProject.id,
        data: values,
      },
    });
  };
  return (
    <PageHeaderWrapper>
      <div className={styles.main}>
        <Spin spinning={loading}></Spin>
        {!loading && (
          <>
            <ProjectInfoForm
              currentProject={currentProject}
              onSubmit={handleSubmit}
              loading={loadingUpdateProject}
              errors={status ? null : errors}
            ></ProjectInfoForm>
            <div>Task setting ( redundancy| scheduler | delete all tasks)</div>
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
};

export default connect(({ setting, loading, project }) => ({
  project,
  setting,
  loading: loading.effects['project/fetchProject'],
  loadingUpdateProject: loading.effects['setting/updateProject'],
}))(Setting);
