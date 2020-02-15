import React from 'react';
import { Button, Tooltip, Badge } from 'antd';
import { Label } from '@/models/connect';
import defaultSettings from '../../../../config/defaultSettings';

const MAX_LEN = 10;

interface LabelPreviewProps {
  label: Label;
  onClick: () => void;
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ label, onClick = () => {} }) => {
  if (!label) {
    return null;
  }

  const isLongText = label.text.length > MAX_LEN;

  const labelText = isLongText ? `${label.text.slice(0, MAX_LEN)}...` : label.text;

  const hotkey = label.prefix_key
    ? `${label.prefix_key.toUpperCase()} - ${label.suffix_key.toUpperCase()}`
    : `${label.suffix_key.toUpperCase()}`;

  return (
    <Badge style={{ backgroundColor: defaultSettings.primaryColor }} count={hotkey}>
      <Button
        style={{ backgroundColor: label.background_color, color: label.text_color }}
        onClick={onClick}
      >
        <div> {isLongText ? <Tooltip title={label.text}>{labelText}</Tooltip> : labelText}</div>
      </Button>
    </Badge>
  );
};

export default LabelPreview;
