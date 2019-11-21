import React from 'react';
import { Row, Col, Tag, Empty, Spin, Card, Typography } from 'antd';
import LabelList from '../LabelList';

function TextClassificationProject({
  annoList = [],
  labelList = [],
  handleRemoveLabel,
  handleAddLabel,
  loading,
  task,
}) {
  const handleChooseLabel = labelKey => {
    const currentAnno = annoList;
    const anno = currentAnno.find(val => val.label === Number(labelKey));
    console.log('[DEBUG]: anno', anno);
    if (anno) {
      handleRemoveLabel(anno.id);
    } else {
      // data form for request
      handleAddLabel({ label: labelKey });
    }
  };
  return (
    <React.Fragment>
      <Card>
        <Row type="flex">
          <Col span={2}>Labels: </Col>
          <Col span={22}>
            <LabelList labelList={labelList} handleChooseLabel={handleChooseLabel} />
          </Col>
        </Row>
      </Card>
      <Card>
        <Row type="flex">
          <Col span={2}>Classification: </Col>
          <Col span={24}>
            <Spin spinning={!!loading}>
              <Row type="flex" gutter={[0, 16]} justify="center">
                {annoList.length > 0 &&
                  Object.values(annoList).map(({ label, id }) => (
                    <Col key={id}>
                      {labelList[label] && (
                        <Tag
                          key={id}
                          color={labelList[label].background_color}
                          closable
                          onClose={() => handleRemoveLabel(id)}
                        >
                          <span>{labelList[label].text}</span>
                        </Tag>
                      )}
                    </Col>
                  ))}
                {!(annoList.length > 0) && (
                  <Col>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No label"
                      imageStyle={{
                        height: 15,
                      }}
                    />
                  </Col>
                )}
              </Row>
            </Spin>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row type="flex" justify="center">
          <Col>{task && <Typography.Title level={3}>{task.text}</Typography.Title>}</Col>
        </Row>
      </Card>
    </React.Fragment>
  );
}
export default TextClassificationProject;
