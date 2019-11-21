import React from 'react';
import { Row, Col } from 'antd';

import { GlobalHotKeys } from 'react-hotkeys';
import LabelPreview from './LabelPreview';

const shortcutKey = shortcut => {
  let ret = shortcut.suffix_key;
  if (shortcut.prefix_key) {
    ret = `${shortcut.prefix_key}+${shortcut.suffix_key}`;
  }
  return ret;
};

function LabelList({ labelList, handleChooseLabel }) {
  const memoHotkey = React.useMemo(() => {
    const keyMap = { ...labelList };
    const handlers = { ...labelList };
    Object.keys(labelList).forEach(key => {
      keyMap[key] = shortcutKey(labelList[key]);
      handlers[key] = () => handleChooseLabel(key);
    });
    return { keyMap, handlers };
  }, [labelList, handleChooseLabel]);

  return (
    <GlobalHotKeys allowChanges keyMap={memoHotkey.keyMap} handlers={memoHotkey.handlers}>
      <Row type="flex" gutter={[24, 16]}>
        {labelList &&
          Object.keys(labelList).map(key => (
            <Col key={key}>
              <LabelPreview
                key={key}
                label={labelList[key]}
                onClick={() => handleChooseLabel(key)}
              />
            </Col>
          ))}
      </Row>
    </GlobalHotKeys>
  );
}
export default LabelList;
