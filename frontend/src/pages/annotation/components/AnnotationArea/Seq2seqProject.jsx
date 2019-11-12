import React from 'react';
import { Row, Col, Tag, Empty, Spin } from 'antd';

function SequenceLabelingProject({ data = [], labelList, onClose, loading }) {
  console.log('[DEBUG]: AnnotationHighlight -> loading', loading);

  return (
    <Spin spinning={!!loading}>
      <Row type="flex" gutter={[0, 16]} justify="center">
        {data.length > 0 &&
          Object.values(data).map(({ label, id }) => (
            <Col key={id}>
              {labelList[label] && (
                <Tag
                  key={id}
                  color={labelList[label].background_color}
                  closable
                  onClose={() => onClose(id)}
                >
                  <span>{labelList[label].text}</span>
                </Tag>
              )}
            </Col>
          ))}
        {!(data.length > 0) && (
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
  );
}
export default SequenceLabelingProject;
