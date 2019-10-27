import React from 'react';
import { Button, Modal, Input, Typography, message } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const Setting = props => {
  const {
    dispatch,
    project: { currentProject },
  } = props;

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
  return (
    <div className={styles.main}>
      <div>Project info</div>
      <div>Task setting ( redundancy| scheduler | delete all tasks)</div>
      <div>Contribution settings</div>
      <div className={styles.deletebutton}>
        <Button type="danger" block onClick={confirmDelete}>
          Delete project
        </Button>
      </div>
    </div>
  );
};

export default connect(({ setting, loading, project }) => ({
  project,
  setting,
  loading: loading.effects['project/fetchProject'],
}))(Setting);
