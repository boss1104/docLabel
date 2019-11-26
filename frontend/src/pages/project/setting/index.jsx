import React from 'react';
import { Button, Modal, Input, Typography, message, Spin } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import ProjectInfoForm from './components/ProjectInfoForm';

const Setting = connect(({ setting, loading, project }) => ({
  project,
  setting,
  loading: loading.effects['project/fetchProject'],
  loadingUpdateProject: loading.effects['setting/updateProject'],
}))(props => {
  const {
    dispatch,
    project: { currentProject },
    loading,
    loadingUpdateProject,
    setting: { hasError, errors },
  } = props;

  const inputRef = React.useRef(null);
  const formRef = React.useRef(null);

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
          message.error('Wrong project name !');
        }
      },
      okButtonProps: {
        type: 'danger',
      },
      onCancel() {},
      centered: true,
    });
  };

  const handleSubmit = async values => {
    try {
      await dispatch({
        type: 'setting/updateProject',
        payload: values,
      });
      message.info('Successfully updated!');
    } catch ({ data }) {
      const valueWithError = {};
      const form = formRef.current;
      if (data) {
        Object.entries(data).forEach(([key, val]) => {
          // const msg = formatMessage({
          //   id: messageID[val[0]],
          // });
          valueWithError[key] = {
            value: form.getFieldValue(key),
            errors: [new Error(val[0])],
          };
        });
      }
      form.setFields({ ...valueWithError });
      message.error('Something wrong! Try again!');
    }
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
              errors={hasError ? null : errors}
              wrappedComponentRef={formRef}
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
});

export default Setting;
