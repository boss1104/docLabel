import React from 'react';
import { Modal, Col, Row, Empty, Typography, Divider } from 'antd';
import { useModal } from 'sunflower-antd';
import styles from './style.less';
import LabelList from '../../LabelList';
import LabelPreview from '../../LabelPreview';

function Tip({ onOpen, onConfirm, labelList }) {
  /**
   * States
   */

  const [visible, setVisible] = React.useState(true);
  const [label, setLabel] = React.useState({});

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
    onConfirm(label);
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
        <div style={{ marginTop: 24 }}>
          <Row>
            <Col>
              <Typography.Text strong>Labeled:</Typography.Text>
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
        </div>
      </Modal>
    </div>
  );
}
export default Tip;
