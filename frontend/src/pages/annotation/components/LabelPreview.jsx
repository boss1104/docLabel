import React from 'react';
import { Button, Tooltip } from 'antd';
import camelcaseKeys from 'camelcase-keys';

const ButtonGroup = Button.Group;
const MAX_LEN = 10;

export default function(props) {
  /**
   * Init variables
   */
  const { label, onClick = () => {} } = props;
  if (!label) {
    return null;
  }
  const { text, prefixKey, suffixKey, backgroundColor, textColor } = camelcaseKeys(label);

  const isLongText = text.length > MAX_LEN;

  const preButton = (
    <Button type="primary" style={{ backgroundColor, color: textColor }}>
      {isLongText ? `${text.slice(0, MAX_LEN)}...` : text}
    </Button>
  );

  return (
    <div>
      {
        <ButtonGroup type="dashed" onClick={onClick}>
          {isLongText ? <Tooltip title={text}>{preButton}</Tooltip> : preButton}
          <Button>{`${prefixKey} - ${suffixKey}`}</Button>
        </ButtonGroup>
      }
    </div>
  );
}
