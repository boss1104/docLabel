import React from 'react';
import { Row, Col, Spin, Card, Typography, Tag } from 'antd';
import { TokenAnnotator } from 'react-text-annotate';
import classNames from 'classnames';
import LabelList from '../LabelList';
import LabelPreview from '../LabelPreview';
import styles from './SequenceLabelingProject.less';
import { useWhyDidYouUpdate } from '@/hooks';
import { AnnotatationContext } from '../AnnotationContext';

function SequenceLabelingProject(prs) {
  const { annoList = [], labelList = [], loading, task, handleRemoveLabel, handleAddLabel } = prs;
  const { isDisabled } = React.useContext(AnnotatationContext);

  const [tag, setTag] = React.useState(null);
  // useWhyDidYouUpdate('SequenceLabelingProject', prs);
  // console.log('Render');
  const handleChange = newVal => {
    console.log('[DEBUG]: SequenceLabelingProject -> newVal', newVal);
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
      const [difference] = annoList.filter(val => !newVal.includes(val));
      handleRemoveLabel(difference.id);
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
                      <div className={styles.labelText}>
                        <Tag
                          className={styles.text}
                          closable
                          style={{ color: props.tag.text_color }}
                          color={props.tag.background_color}
                          onClick={() => props.onClick({ start: props.start, end: props.end })}
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
