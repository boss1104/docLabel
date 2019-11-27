import React from 'react';
import { Row, Col, Tooltip, Spin, Card, Icon, Typography, Tag } from 'antd';
import { TokenAnnotator } from 'react-text-annotate';
import classNames from 'classnames';
import LabelList from '../LabelList';
import LabelPreview from '../LabelPreview';
import styles from './SequenceLabelingProject.less';

function SequenceLabelingProject({
  annoList = [],
  labelList = [],
  loading,
  task,
  handleRemoveLabel,
  handleAddLabel,
}) {
  const [value, setValue] = React.useState([]);
  const [tag, setTag] = React.useState(null);

  const handleChange = newVal => {
    const isAdd = value.length < newVal.length;
    if (isAdd) {
      const [difference] = newVal.filter(val => !value.includes(val));
      handleAddLabel({
        start_offset: difference.start,
        end_offset: difference.end,
        label: difference.tag.id,
      });
    } else {
      const [difference] = value.filter(val => !newVal.includes(val));
      handleRemoveLabel(difference.id);
    }
    setValue(newVal);
  };

  const handleChooseLabel = labelKey => {
    if (tag.id !== labelKey) {
      setTag(labelList[labelKey]);
    }
  };

  React.useEffect(() => {
    setTag(Object.values(labelList)[0]);
  }, [labelList]);

  React.useEffect(() => {
    const annoMap = annoList.map(val => ({
      start: val.start_offset,
      end: val.end_offset,
      tag: labelList[val.label],
      id: val.id,
    }));
    setValue(annoMap);
  }, [annoList]);

  const isDisabled = annoList[0] && annoList[0].finished;

  return (
    <React.Fragment>
      <Card>
        <Row gutter={[0, 16]}>
          <Col>
            <Typography.Text strong>Labels</Typography.Text>
          </Col>
          <Col>
            <LabelList labelList={labelList} handleChooseLabel={handleChooseLabel} />
          </Col>
        </Row>
      </Card>
      <Card>
        <Row gutter={[0, 16]}>
          <Col>
            <Typography.Text strong>Choosen label</Typography.Text>
          </Col>
          <Col>
            <Row type="flex" justify="center">
              <Col>
                <LabelPreview label={tag} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <Card>
        <Spin spinning={!!loading} size="large">
          {task && (
            <Row
              type="flex"
              justify="center"
              align="middle"
              style={{ minHeight: '165px' }}
              className={classNames({
                [styles.disabled]: isDisabled,
              })}
            >
              <Col className={styles.tokenText}>
                <TokenAnnotator
                  tokens={task.text.split(' ')}
                  value={value}
                  onChange={handleChange}
                  getSpan={span => ({
                    ...span,
                    tag,
                  })}
                  renderMark={props => (
                    <React.Fragment key={props.key}>
                      <div className={styles.labelText}>
                        <Tag
                          className={styles.text}
                          closable
                          color={props.tag.background_color}
                          onClick={() => props.onClick({ start: props.start, end: props.end })}
                        >
                          {props.tag.text}
                        </Tag>
                        <div
                          className={styles.content}
                          style={{ borderColor: props.tag.background_color }}
                        >
                          {props.content}
                        </div>
                      </div>{' '}
                    </React.Fragment>
                  )}
                />
              </Col>
            </Row>
          )}
        </Spin>
      </Card>
    </React.Fragment>
  );
}
export default SequenceLabelingProject;
