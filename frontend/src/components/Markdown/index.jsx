import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import SyntaxHighlighter from 'react-syntax-highlighter/';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './index.less';

const CodeBlock = ({ language = null, value }) => (
  <SyntaxHighlighter language={language} style={darcula}>
    {value}
  </SyntaxHighlighter>
);

function Markdown({ markdownSrc }) {
  return (
    <div className={styles.main}>
      <ReactMarkdown
        className="result"
        source={markdownSrc}
        renderers={{ code: CodeBlock }}
        escapeHtml={false}
      />
    </div>
  );
}
export default Markdown;
