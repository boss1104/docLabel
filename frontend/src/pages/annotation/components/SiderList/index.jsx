import { PROJECT_TYPE } from '@/pages/constants';
import { Button, Col, Descriptions, Icon, Modal, Row, Select, Typography, Spin } from 'antd';
import React, { useContext } from 'react';
import { Link } from 'umi';
import { useAnnotaionContext } from '../AnnotationContext';
import styles from './index.less';

function SiderList({ itemProps, onSubmit }) {
  const {
    currentProject,
    annotations,
    annoList,
    taskList,
    isApprover,
    isNotApprover,
    annotationValue,
    setAnnotationValue,
    pagination,
    sidebarTotal,
    sidebarPage,
    submitLoading,
    remaining,
    projectLoading,
    isProjectAdmin,
  } = useAnnotaionContext();

  const { name } = itemProps;

  const isSubmitDisabled = Number(remaining) !== 0;

  const isFinished = annoList && annoList[0] && annoList[0].finished;

  const hasData = currentProject && Object.keys(currentProject).length;

  const dataLoading = projectLoading || !hasData;

  const getAnnotators = () => {
    if (Object.keys(currentProject).length) {
      return currentProject.users;
    }
    return [];
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Are you sure to submit this task ?',
      content: 'You can not change the answers after submit.',
      onOk: onSubmit,
      centered: true,
      okText: 'Submit',
    });
  };

  if (name === 'menu') {
    return (
      <Spin spinning={dataLoading} size="small">
        {hasData && (
          <div style={{}}>
            <Descriptions title="Project Info" size="middle" column={1}>
              <Descriptions.Item label="Name">{currentProject.name}</Descriptions.Item>
              <Descriptions.Item label="Type">
                {PROJECT_TYPE[currentProject.project_type].tag}
              </Descriptions.Item>
              {isProjectAdmin && (
                <Descriptions.Item label="Settings">
                  <Link to={`/projects/${currentProject.id}/dashboard`}>Edit</Link>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Spin>
    );
  }

  if (name === 'about') {
    return (
      <div style={{ textAlign: 'center', cursor: '' }}>
        {`About ${pagination.total} tasks. (page ${sidebarPage} of ${sidebarTotal})`}
      </div>
    );
  }

  if (name === 'loading') {
    return (
      <div style={{ textAlign: 'center' }}>
        <Spin type="small" />
      </div>
    );
  }

  if (name === 'info') {
    return (
      <Spin spinning={dataLoading} size="small">
        {hasData && (
          <div style={{}}>
            <Descriptions title="Project Info" size="middle" column={1}>
              <Descriptions.Item label="Name">{currentProject.name}</Descriptions.Item>
              <Descriptions.Item label="Type">
                {PROJECT_TYPE[currentProject.project_type].tag}
              </Descriptions.Item>
              {isProjectAdmin && (
                <Descriptions.Item label="Settings">
                  <Link to={`/projects/${currentProject.id}/dashboard`}>Edit</Link>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Spin>
    );
  }

  if (name === 'field' && isNotApprover) {
    return (
      <Button
        type="primary"
        size="large"
        block
        onClick={showConfirm}
        disabled={isSubmitDisabled || isFinished}
        loading={submitLoading}
      >
        {isFinished ? 'Finished' : 'Submit'}
      </Button>
    );
  }

  if (name === 'field' && isApprover) {
    return (
      <Select
        showSearch
        placeholder="Select a annotation"
        onChange={value => {
          setAnnotationValue(value);
        }}
        value={annotationValue}
        // onFocus={onFocus}
        // onBlur={onBlur}
        // onSearch={onSearch}
        size="large"
        style={{ width: '100%' }}
      >
        {getAnnotators().map(item => (
          <Select.Option value={item.id} key={item.id}>
            <span style={{ fontWeight: 500 }}>{item.username}</span>
            <span> - {item.full_name}</span>
          </Select.Option>
        ))}
      </Select>
    );
  }

  return (
    <Row gutter={16} type="flex">
      <Col span={2}>
        {annotations[name] && annotations[name].length !== 0 && <Icon type="check" />}
      </Col>
      <Col span={22}>
        <Typography.Paragraph ellipsis>{taskList[name].text}</Typography.Paragraph>
      </Col>
    </Row>
  );
}
export default React.memo(SiderList);
