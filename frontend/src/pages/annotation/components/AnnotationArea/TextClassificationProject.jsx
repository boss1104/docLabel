import React from 'react';
import { Row, Col, Tag, Empty, Spin, Card, Typography } from 'antd';
import classNames from 'classnames';
import LabelList from '../LabelList';
import styles from './TextClassificationProject.less';
import { AnnotatationContext } from '../AnnotationContext';

function TextClassificationProject({
  annoList = [],
  labelList = [],
  handleRemoveLabel,
  handleAddLabel,
  loading,
  task,
}) {
  const { isDisabled } = React.useContext(AnnotatationContext);

  const handleChooseLabel = labelKey => {
    const currentAnno = annoList;
    const anno = currentAnno.find(val => val.label === Number(labelKey));
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
        <Row gutter={[0, 16]}>
          <Col>
            <Typography.Text strong>Labels</Typography.Text>
          </Col>
          <Col className={classNames({ [styles.disabled]: isDisabled })}>
            <LabelList labelList={labelList} handleChooseLabel={handleChooseLabel} />
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={[0, 16]}>
          <Col>
            <Typography.Text strong>Classification</Typography.Text>
          </Col>
          <Col>
            <Spin spinning={!!loading}>
              <Row
                type="flex"
                gutter={[16, 16]}
                justify="center"
                className={classNames(styles.annoList, { [styles.disabled]: isDisabled })}
              >
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
                      description={false}
                      imageStyle={{
                        height: 24,
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
