import { Col, Divider, Empty, Modal, Row, Typography, Input } from 'antd';
import React, { useState } from 'react';
import { useModal } from 'sunflower-antd';
import LabelList from '../../LabelList';
import LabelPreview from '../../LabelPreview';
import styles from './style.less';

function Tip({ onOpen, onConfirm, labelList }) {
  /**
   * States
   */

  const [visible, setVisible] = useState(true);
  const [label, setLabel] = useState({});
  const [comment, setComment] = useState('');

  const { modalProps, show, close } = useModal({
    defaultVisible: false,
  });

  /**
   * Handler
   */
  const handleChooseLabel = labelKey => {
    if (label.id !== labelKey) {
      setLabel(labelList[labelKey]);
    }
  };

  const onSubmit = () => {
    onConfirm(label, comment);
  };

  /**
   * Variables
   */

  /**
   * Render
   */
  return (
    <div className={styles.tip}>
      {visible && (
        <div>
          <div
            className={styles.compact}
            onClick={() => {
              onOpen();
              setVisible(false);
              show();
            }}
          >
            Add label
          </div>
          <div className={styles.arrow} />
        </div>
      )}
      <Modal
        {...modalProps}
        title="Add Label"
        okText="Submit"
        okButtonProps={{
          disabled: !Object.keys(label).length,
        }}
        onOk={onSubmit}
        width={600}
        centered
      >
        <LabelList labelList={labelList} handleChooseLabel={handleChooseLabel} />
        <Divider />
        <div style={{ marginTop: 24, padding: 16 }}>
          <Row>
            <Col>
              <Typography.Text strong>Label:</Typography.Text>
            </Col>
            <Col style={{ textAlign: 'center' }}>
              {!!Object.keys(label).length && (
                <div style={{ marginBottom: 8 }}>
                  <LabelPreview label={label} />
                </div>
              )}
              {!Object.keys(label).length && (
                <Empty
                  style={{ margin: 0 }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={false}
                  imageStyle={{
                    height: 32,
                  }}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Typography.Text strong>Comment:</Typography.Text>
            </Col>
            <Col style={{ textAlign: 'center' }}>
              <Input.TextArea
                placeholder="Enter annotation comment (Option)"
                rows={2}
                allowClear
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
}
export default Tip;
