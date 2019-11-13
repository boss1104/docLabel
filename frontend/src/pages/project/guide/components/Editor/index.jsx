import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { Row, Col } from 'antd';

import styles from './index.less';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/markdown/markdown';

function Editor({ value, onChange }) {
  return (
    <CodeMirror
      autoCursor={false}
      className={styles.main}
      value={value}
      options={{
        mode: 'markdown',
        theme: 'dracula',
        lineNumbers: true,
      }}
      onChange={(editor, data, newValue) => {
        onChange(newValue);
      }}
    />
  );
}
export default Editor;
