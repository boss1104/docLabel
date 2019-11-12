import React from 'react';
import { Row, Col, Tooltip, Spin, Card } from 'antd';
import { TextAnnotator, TokenAnnotator } from 'react-text-annotate';
import LabelList from '../LabelList';
import LabelPreview from '../LabelPreview';

// entityPositions: {
//   type: Array, // [{'startOffset': 10, 'endOffset': 15, 'label_id': 1}]
//   default: () => [],
// },

function SequenceLabelingProject({
  annoList = [],
  labelList = [],
  onClose,
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

  return (
    <React.Fragment>
      <LabelList labelList={labelList} handleChooseLabel={handleChooseLabel} />
      <Card>
        <Row type="flex">
          <Col span={2}>Choosen label: </Col>
          <Col span={22}>
            <LabelPreview label={tag} />
          </Col>
        </Row>
      </Card>
      <Card>
        <Spin spinning={!!loading} size="large">
          <Row type="flex" gutter={[0, 16]} justify="center">
            {task && (
              <TokenAnnotator
                style={{
                  fontFamily: 'IBM Plex Sans',
                  maxWidth: 500,
                  lineHeight: 1.5,
                  fontSize: 20,
                }}
                tokens={task.text.split(' ')}
                value={value}
                onChange={handleChange}
                getSpan={span => ({
                  ...span,
                  tag,
                })}
                renderMark={props => (
                  <Tooltip title={props.tag.text}>
                    <mark
                      style={{ backgroundColor: props.tag.background_color }}
                      onClick={() => props.onClick({ start: props.start, end: props.end })}
                    >
                      {props.content}
                    </mark>{' '}
                  </Tooltip>
                )}
              />
            )}
          </Row>
        </Spin>
      </Card>
    </React.Fragment>
  );
}
export default SequenceLabelingProject;
