import React from 'react';
import { Button, Card, Row, Col, Progress, Modal, Typography, Tooltip, Popconfirm } from 'antd';
import Markdown from '@/components/Markdown';
import { AnnotatationContext } from './AnnotationContext';

function ProgressBar({ totalTask, remaining, currentProject, onClickApproved, task }) {
  const { annoList = [] } = React.useContext(AnnotatationContext);
  // Modal
  const [visible, setVisible] = React.useState(false);

  const hasData = currentProject && !!Object.keys(currentProject).length;
  const isAnnotationApprover =
    hasData &&
    (currentProject.current_users_role.is_annotation_approver ||
      currentProject.current_users_role.is_project_admin);

  const isApproved = annoList[0] && annoList[0].prob !== 0;
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
                <Tooltip title={isApproved ? 'Approved' : 'UnApproved'}>
                  <Popconfirm
                    title="Are you sure approve this task?"
                    placement="topLeft"
                    onConfirm={onClickApproved}
                    disabled={isApproved}
                  >
                    <Button
                      icon={isApproved ? 'check-circle' : 'question-circle'}
                      size="large"
                      style={isApproved ? { color: '#00a854' } : {}}
                    />
                  </Popconfirm>
                </Tooltip>
              </Col>
            )}
          </Row>
        </Col>
        <Col md={{ span: 12 }} xs={{ span: 24 }}>
          <div style={{ maxWidth: '350px', margin: 'auto' }}>
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
