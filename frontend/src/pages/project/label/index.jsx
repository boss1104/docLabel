import React from 'react';
import { Form, Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

import styles from './index.less';
import CreateForm from './components/CreateForm';

export default Form.create()(
  connect(({ labels, loading }) => ({
    labels,
    loading: loading.models.label,
    createLoading: loading.effects['label/add'],
  }))(props => {
    const { dispatch, createLoading } = props;
    const [modalVisible, setModalVisible] = React.useState(false);
    const formRef = React.useRef(null);

    const callBackFormError = errors => {
      if (errors) {
        const [key, errorMsg] = errors.non_field_errors[0].split(':');
        console.log(key, errorMsg);
        formRef.current.setFields({
          [key]: {
            value: formRef.current.getFieldValue(key),
            errors: [new Error(errorMsg)],
          },
        });
        message.error('Something wrong!');
      } else {
        message.success('Label added successfully!');
      }
    };

    const handleAddLabel = formValues => {
      dispatch({
        type: 'label/add',
        payload: formValues,
        callback: callBackFormError,
      });
    };
    return (
      <PageHeaderWrapper
        content={
          <Button icon="plus" type="primary" onClick={() => setModalVisible(true)}>
            Add label
          </Button>
        }
      >
        Card Table
        <hr />
        <CreateForm
          onCreate={form => {
            formRef.current = form;
          }}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          loading={createLoading}
          handleAdd={handleAddLabel}
        />
        <hr />
        UpdateForm
      </PageHeaderWrapper>
    );
  }),
);
