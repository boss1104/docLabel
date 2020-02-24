import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Layout, List, Popconfirm, Row, Typography } from 'antd';
import React, { useState } from 'react';
import LabelPreview from '../../LabelPreview';
import styles from './style.less';

function Sidebar({
  annoList = [],
  labelList,
  handleRemoveLabel,
  setActiveKey,
  activeKey,
  setCurrentAnno,
  dark,
  isDisabled,
}) {
  const handleDeleteAnno = annoId => {
    if (annoId) {
      handleRemoveLabel(annoId);
    }
  };

  const [collapsed, setCollapsed] = useState(true);

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
    <Layout.Sider
      width={320}
      className={styles.sidebar}
      theme={dark ? 'dark' : 'light'}
      breakpoint="xxl"
      collapsedWidth="0"
      onBreakpoint={broken => {
        // console.log(broken);
      }}
      reverseArrow
      // collapsed={collapsed}
      // onCollapse={$collapsed => setCollapsed($collapsed)}
    >
      <div className={styles.title}>
        <Typography.Title level={4}>Annotation Label</Typography.Title>
      </div>
      <Collapse
        accordion
        activeKey={[`${activeKey}`]}
        onChange={key => {
          setActiveKey(key);
        }}
        expandIconPosition="right"
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
                    <LabelPreview label={val} />
                  </Col>
                </Row>
              }
              // eslint-disable-next-line react/no-array-index-key
              key={val.id}
            >
              <List
                loading={loading}
                dataSource={val.array}
                bordered={false}
                renderItem={({ content, position, label, id, image_url: url }) => (
                  <List.Item
                    onClick={() => {
                      setCurrentAnno(id);
                    }}
                    className={styles.sidebarItem}
                  >
                    <Row
                      gutter={[12, 24]}
                      type="flex"
                      style={{ flex: 1, padding: '0 12px' }}
                      align="middle"
                      justify="space-between"
                    >
                      <Col span={24}>
                        {content.text && (
                          <Typography.Text mark strong className={styles.contentMark}>
                            {content.text.length > 90
                              ? `${content.text.slice(0, 90).trim()}…`
                              : `${content.text}`}
                          </Typography.Text>
                        )}
                        {content.image && (
                          <div className={styles.dataImage}>
                            <img src={url} alt="Screenshot" />
                          </div>
                        )}
                      </Col>
                      {content.comment ? (
                        <Col span={24}>
                          <Typography.Paragraph ellipsis style={{ marginBottom: 0 }}>
                            {content.comment}
                          </Typography.Paragraph>
                        </Col>
                      ) : null}
                      {/*  */}
                      <Col>
                        <Typography.Text code className={styles.labelPage}>
                          Page {position.pageNumber}
                        </Typography.Text>
                      </Col>
                      <Col>
                        {!isDisabled && (
                          <Popconfirm
                            title="Are you sure delete this annotation?"
                            onConfirm={() => handleDeleteAnno(id)}
                            placement="topRight"
                          >
                            <Button icon={<DeleteOutlined />} shape="circle-outline" type="dashed" />
                          </Popconfirm>
                        )}
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
