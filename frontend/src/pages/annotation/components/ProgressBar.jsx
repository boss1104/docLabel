import React from 'react';
import { Button, Card, Row, Col, Progress, Modal, Typography, Tooltip } from 'antd';
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
      <Row type="flex" gutter={[0, 24]} justify="space-between" align="middle">
        <Col md={{ span: 12 }} xs={{ span: 24 }}>
          <Row type="flex" gutter={24}>
            <Col>
              <Tooltip title="Guide line">
                <Button icon="deployment-unit" size="large" onClick={() => setVisible(true)} />
              </Tooltip>

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
              <Tooltip title="Document Meta">
                <Button icon="inbox" size="large" />
              </Tooltip>
            </Col>
            {isAnnotationApprover && (
              <Col>
                <Tooltip title="Approved">
                  <Button icon={approved ? 'check-circle' : 'question-circle'} size="large" />
                </Tooltip>
              </Col>
            )}
          </Row>
        </Col>
        <Col md={{ span: 12 }} xs={{ span: 24 }}>
          <div style={{ maxWidth: '350px' }}>
            <Tooltip title="Progress" placement="topRight">
              <Progress
                percent={Math.floor(((totalTask - remaining) / totalTask) * 100)}
                format={() => `${totalTask - remaining}/${totalTask}`}
                status="active"
                strokeColor="#00a854"
                strokeWidth={15}
              />
            </Tooltip>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
export default ProgressBar;
