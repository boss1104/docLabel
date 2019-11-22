import React from 'react';
import { Layout, Button, List, Row, Col, Typography, Tag, Popconfirm, Icon, Collapse } from 'antd';
import styles from './style.less';

// const updateHash = highlight => {
//   location.hash = `highlight-${highlight.id}`;
// };

function Sidebar({ annoList = [], labelList, handleRemoveLabel, setActiveKey, activeKey }) {
  // console.log('[DEBUG]: Sidebar -> activeKey', activeKey);
  const handleDeleteAnno = annoId => {
    if (annoId) {
      handleRemoveLabel(annoId);
    }
  };

  const dataObjectList = {
    ...labelList,
  };

  Object.keys(labelList).forEach(key => {
    // console.log('[DEBUG]: Sidebar -> key', key);
    dataObjectList[key] = {
      ...dataObjectList[key],
      array: annoList.filter(val => val.label === Number(key)),
    };
  });
  const loading = !labelList;

  return (
    <Layout.Sider width={400} className={styles.sidebar}>
      <div>
        <h2 style={{ marginBottom: '24px' }}>Annotation Label</h2>
      </div>
      <Collapse
        accordion
        activeKey={[`${activeKey}`]}
        onChange={key => {
          setActiveKey(key);
        }}
      >
        {!!Object.keys(dataObjectList).length &&
          Object.values(dataObjectList).map((val, idx) => (
            <Collapse.Panel
              header={
                <Row type="flex" gutter={24}>
                  <Col>
                    <Typography.Text strong style={{ lineHeight: '32px' }}>
                      Label:
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Tag color={val.background_color}>
                      <Typography.Text strong>{val.text}</Typography.Text>
                    </Tag>
                  </Col>
                </Row>
              }
              // eslint-disable-next-line react/no-array-index-key
              key={val.id}
            >
              <List
                loading={loading}
                bordered
                dataSource={val.array}
                renderItem={({ content, position, label, id, image_url: url }) => (
                  <List.Item
                    onClick={() => {
                      // updateHash(highlight);
                    }}
                    className={styles.sidebarItem}
                  >
                    <Row gutter={[0, 24]} style={{ flex: 1 }} align="middle">
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
                      {/*  */}
                      <Col span={22}>
                        <Typography.Text code className={styles.labelPage}>
                          Page {position.pageNumber}
                        </Typography.Text>
                      </Col>
                      <Col span={2}>
                        <Popconfirm
                          title="Are you sure delete this annotation?"
                          onConfirm={() => handleDeleteAnno(id)}
                        >
                          <Icon type="delete" />
                        </Popconfirm>
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            </Collapse.Panel>
          ))}
      </Collapse>
    </Layout.Sider>
  );
}

export default React.memo(Sidebar);
