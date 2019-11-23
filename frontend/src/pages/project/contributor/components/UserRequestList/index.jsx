import React from 'react';
import { Card, List, Button, Row, Col, Typography, Tag, Popconfirm } from 'antd';
import styles from './index.less';

import { ROLE_LABELS } from '@/pages/constants';

function UserRequestList({ list = [], onResolve, onReject, loading }) {
  const [hoverItem, setHoverItem] = React.useState(null);
  return (
    <div className={styles.main}>
      <Card bordered={false}>
        <List
          header={<Typography.Title level={4}>Contribution requests</Typography.Title>}
          bordered={false}
          dataSource={list}
          loading={loading}
          renderItem={(item, idx) => (
            <List.Item
              onMouseEnter={() => setHoverItem(idx)}
              onMouseLeave={() => setHoverItem(null)}
            >
              <Row type="flex" justify="space-between" style={{ flex: 1 }}>
                <Col span={20}>
                  <div
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    <Typography.Paragraph>
                      <Typography.Text>User</Typography.Text>{' '}
                      <Typography.Text code strong>
                        {item.actor.username}
                      </Typography.Text>{' '}
                      <Typography.Text>{item.verb}</Typography.Text>{' '}
                      {item.action_object && (
                        <Typography.Text code strong>
                          {ROLE_LABELS[item.action_object.name]}
                        </Typography.Text>
                      )}{' '}
                      <Typography.Text>on</Typography.Text>{' '}
                      <Typography.Text code strong>
                        {item.target.name}.
                      </Typography.Text>
                    </Typography.Paragraph>
                  </div>
                </Col>
                <Col span={4}>
                  {hoverItem === idx && (
                    <Row gutter={[0, 16]} type="flex" justify="space-around">
                      <Col>
                        <Popconfirm
                          title="Are you sure resole this user request?"
                          onConfirm={() => onResolve(item)}
                        >
                          <Button type="dashed" icon="check">
                            Resolve
                          </Button>
                        </Popconfirm>
                      </Col>
                      <Col>
                        <Popconfirm
                          title="Are you sure reject this user request?"
                          onConfirm={() => onReject(item)}
                        >
                          <Button type="danger" icon="close">
                            Reject
                          </Button>
                        </Popconfirm>
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
export default React.memo(UserRequestList);
