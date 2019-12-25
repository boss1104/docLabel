import { Card, Col, Row, Spin, Tag, Typography } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { TokenAnnotator } from 'react-text-annotate';
import { AnnotatationContext } from '../AnnotationContext';
import LabelList from '../LabelList';
import LabelPreview from '../LabelPreview';
import styles from './SequenceLabelingProject.less';

function SequenceLabelingProject(prs) {
  const {
    isDisabled,
    annoList = [],
    labelList = [],
    handleRemoveLabel,
    handleAddLabel,
    task,
    annoLoading: loading,
  } = React.useContext(AnnotatationContext);
  const [tag, setTag] = React.useState(null);

  const handleChange = newVal => {
    const isAdd = annoList.length < newVal.length;
    if (isAdd) {
      const [difference] = newVal.filter(val => !val.id);
      handleAddLabel({
        start_offset: difference.start,
        end_offset: difference.end,
        label: difference.tag.id,
        tokens: difference.tokens,
      });
    } else {
      const annoListTemp = annoList.map(item => item.id);
      const newValTemp = newVal.map(item => item.id);
      const [id] = annoListTemp.filter(val => !newValTemp.includes(val));
      handleRemoveLabel(id);
    }
  };

  const handleChooseLabel = labelKey => {
    if (tag.id !== labelKey) {
      setTag(labelList[labelKey]);
    }
  };

  React.useEffect(() => {
    setTag(Object.values(labelList)[0]);
  }, [labelList]);

  const getTokenValue = () => {
    const list = [...annoList];
    return list.map(val => ({
      start: val.start_offset,
      end: val.end_offset,
      tokens: val.tokens,
      tag: labelList[val.label],
      id: val.id,
    }));
  };

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
                  value={getTokenValue()}
                  onChange={handleChange}
                  getSpan={span => ({
                    ...span,
                    tag,
                  })}
                  renderMark={props => (
                    <React.Fragment key={props.key}>
                      <div className={styles.labelText} title="Click to remove">
                        <Tag
                          className={styles.text}
                          style={{ color: props.tag.text_color }}
                          color={props.tag.background_color}
                          closable
                          onClose={e => {
                            e.preventDefault();
                            props.onClick({ start: props.start, end: props.end });
                          }}
                        >
                          {props.tag.text}
                        </Tag>
                        <div
                          className={styles.content}
                          style={{ borderColor: props.tag.background_color }}
                        >
                          <div className={styles.textContent}>{props.content}</div>
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
export default React.memo(SequenceLabelingProject);
