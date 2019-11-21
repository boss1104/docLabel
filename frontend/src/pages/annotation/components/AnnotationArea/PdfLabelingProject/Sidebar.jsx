import React from 'react';
import { Layout, Button, List, Row, Col, Typography, Tag, Popconfirm, Icon } from 'antd';
import styles from './style.less';

// const updateHash = highlight => {
//   location.hash = `highlight-${highlight.id}`;
// };

function Sidebar({ annoList, labelList, handleRemoveLabel }) {
  const handleDeleteAnno = annoId => {
    console.log('[DEBUG]: Sidebar -> annoId', annoId);
    if (annoId) {
      handleRemoveLabel(annoId);
    }
  };

  const loading = !labelList;
  return (
    <Layout.Sider width={400} className={styles.sidebar}>
      <List
        loading={loading}
        header={
          <div>
            <h2 style={{ marginBottom: '24px' }}>Annotation Label</h2>
          </div>
        }
        // footer={
        //   <div>
        //     <Button>Submit Button</Button>
        //   </div>
        // }
        bordered
        dataSource={annoList}
        renderItem={({ content, position, label, id, image_url: url }) => (
          <List.Item
            onClick={() => {
              // updateHash(highlight);
            }}
            className={styles.sidebarItem}
          >
            <Row gutter={[0, 24]} style={{ flex: 1 }} align="middle">
              <Col span={4}>
                <Typography.Text strong style={{ lineHeight: '32px' }}>
                  Label:
                </Typography.Text>
              </Col>
              <Col span={18}>
                <Tag color={labelList[label].background_color}>
                  <Typography.Text strong>{labelList[label].text}</Typography.Text>
                </Tag>
              </Col>
              <Col span={2}>
                <Popconfirm
                  title="Are you sure delete this annotation?"
                  onConfirm={() => handleDeleteAnno(id)}
                >
                  <Icon type="delete" />
                </Popconfirm>
              </Col>
              <Col span={24}>
                {content.text ? (
                  <Typography.Text code mark strong className={styles.contentMark}>
                    {content.text.length > 90
                      ? `${content.text.slice(0, 90).trim()}…`
                      : `${content.text}`}
                  </Typography.Text>
                ) : null}
                {content.image ? (
                  <div className={styles.dataImage}>
                    <img src={url} alt="Screenshot" />
                  </div>
                ) : null}
              </Col>
              <Col span={24}>
                <Typography.Text code className={styles.labelPage}>
                  Page {position.pageNumber}
                </Typography.Text>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </Layout.Sider>
  );
}

export default React.memo(Sidebar);
