import React from 'react';
import { Button, Card, Row, Col, Progress, Modal, Typography } from 'antd';
import Markdown from '@/components/Markdown';

function ProgressBar({ totalTask, remaining, currentProject }) {
  // Modal
  const [visible, setVisible] = React.useState(false);

  const approved = true;
  const hasData = currentProject && Object.keys(currentProject).length;
  const isAnnotationApprover =
    hasData &&
    (currentProject.current_users_role.is_annotation_approver ||
      currentProject.current_users_role.is_project_admin);
  return (
    <Card>
      <Row type="flex" gutter={24}>
        <Col span={2}>Progress:</Col>
        <Col span={8}>
          <Progress
            percent={Math.floor(((totalTask - remaining) / totalTask) * 100)}
            format={() => `${totalTask - remaining}/${totalTask}`}
            status="active"
            strokeColor="#00a854"
            strokeWidth={15}
          />
        </Col>
        <Col span={14}>
          <Row type="flex" gutter={48} justify="end">
            <Col>
              {isAnnotationApprover && (
                <Button icon={approved ? 'check-circle' : 'question-circle'} size="large" />
              )}
            </Col>
            <Col>
              <Button icon="deployment-unit" size="large" onClick={() => setVisible(true)} />
              <Modal
                width={700}
                title={<Typography.Title level={4}>Annotation Guideline</Typography.Title>}
                visible={visible}
                footer={null}
                onCancel={() => setVisible(false)}
              >
                <div style={{ margin: '0 24px', overflow: 'auto' }}>
                  <Markdown markdownSrc={currentProject.guideline} />
                </div>
              </Modal>
            </Col>
            <Col>
              <Button icon="inbox" size="large" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
export default ProgressBar;