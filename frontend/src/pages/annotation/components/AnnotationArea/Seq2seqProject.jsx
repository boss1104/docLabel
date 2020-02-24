import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Input, List, Row, Spin, Typography } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { useAnnotaionContext } from '../AnnotationContext';
import styles from './Seq2seqProject.less';

const { TextArea } = Input;

function Seq2seqProject(props) {
  const {
    isDisabled,
    annoList = [],
    handleRemoveLabel,
    handleAddLabel,
    handleEditLabel,
    task,
    annoLoading: loading,
  } = useAnnotaionContext();

  const [newAnno, setNewAnno] = React.useState('');
  const [value, setValue] = React.useState('');
  const [editedAnno, setEditedAnno] = React.useState(null);

  /**
   * Handlers
   */

  const handleEditing = item => {
    setEditedAnno(item);
    setValue(item.text);
  };

  const handleDoneEdit = () => {
    if (value !== editedAnno.text) {
      handleEditLabel(editedAnno.id, { ...editedAnno, text: value });
    }
    setEditedAnno(null);
    setValue('');
  };

  const handleAddAnno = e => {
    e.preventDefault();
    handleAddLabel({ text: newAnno });
    setNewAnno('');
  };

  const handleRemoveAnno = id => {
    handleRemoveLabel(id);
  };

  const handleCancelEdit = e => {
    if (e.keyCode === 27) {
      setEditedAnno(null);
      setValue('');
    }
  };

  return (
    <React.Fragment>
      <Card>
        <Row type="flex" justify="center">
          <Col>{task && <Typography.Title level={3}>{task.text}</Typography.Title>}</Col>
        </Row>
      </Card>
      <Spin spinning={!!loading}>
        <Row className={styles.translation}>
          {!isDisabled && (
            <TextArea
              value={newAnno}
              onChange={e => setNewAnno(e.target.value)}
              placeholder="What is your response ?"
              autoSize={{ minRows: 2, maxRows: 5 }}
              onPressEnter={handleAddAnno}
            />
          )}
          <List
            size="default"
            bordered
            className={classNames({ [styles.disabled]: isDisabled })}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No translation"
                  imageStyle={{
                    height: 15,
                  }}
                />
              ),
            }}
            dataSource={annoList}
            renderItem={item => (
              <React.Fragment>
                {item === editedAnno ? (
                  <TextArea
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    autoSize={{ minRows: 2, maxRows: 5 }}
                    onPressEnter={() => handleDoneEdit(value)}
                    onBlur={() => handleDoneEdit(value)}
                    onKeyDown={handleCancelEdit}
                  />
                ) : (
                  <List.Item
                    actions={[]}
                    onClick={() => handleEditing(item)}
                    onBlur={handleDoneEdit}
                  >
                    <Row type="flex" justify="space-between" style={{ flex: 1, margin: '0 16px' }}>
                      <Col>
                        <Typography.Title level={3}>{item.text}</Typography.Title>
                      </Col>
                      <Col>
                        <Button
                          icon={<CloseOutlined />}
                          shape="circle"
                          onClick={() => handleRemoveAnno(item.id)}
                        />
                      </Col>
                    </Row>
                  </List.Item>
                )}
              </React.Fragment>
            )}
          />
        </Row>
      </Spin>
    </React.Fragment>
  );
}
export default Seq2seqProject;
