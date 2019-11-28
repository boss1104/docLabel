import React from 'react';
import { Layout, List, Row, Col, Typography, Tag, Popconfirm, Icon, Collapse, Button } from 'antd';
import styles from './style.less';

function Sidebar({
  annoList = [],
  labelList,
  handleRemoveLabel,
  setActiveKey,
  activeKey,
  setCurrentAnno,
  dark,
}) {
  const handleDeleteAnno = annoId => {
    if (annoId) {
      handleRemoveLabel(annoId);
    }
  };

  const dataObjectList = {
    ...labelList,
  };

  Object.keys(labelList).forEach(key => {
    dataObjectList[key] = {
      ...dataObjectList[key],
      array: annoList.filter(val => val.label === Number(key)),
    };
  });
  const loading = !labelList;

  return (
    <Layout.Sider width={400} className={styles.sidebar} theme={dark ? 'dark' : 'light'}>
      <div className={styles.title}>
        <Typography.Title level={4}>Annotation Label</Typography.Title>
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
                <Row type="flex" gutter={48}>
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
                dataSource={val.array}
                renderItem={({ content, position, label, id, image_url: url }) => (
                  <List.Item
                    onClick={() => {
                      setCurrentAnno(id);
                    }}
                    className={styles.sidebarItem}
                  >
                    <Row gutter={[0, 24]} style={{ flex: 1 }} align="middle">
                      <Col>
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
                      <Row type="flex" justify="space-between">
                        <Col>
                          <Typography.Text code className={styles.labelPage}>
                            Page {position.pageNumber}
                          </Typography.Text>
                        </Col>
                        <Col>
                          <Popconfirm
                            title="Are you sure delete this annotation?"
                            onConfirm={() => handleDeleteAnno(id)}
                            placement="topRight"
                          >
                            <Button icon="delete" shape="circle-outline" />
                          </Popconfirm>
                        </Col>
                      </Row>
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
