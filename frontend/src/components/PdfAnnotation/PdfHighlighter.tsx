import React, { useEffect } from 'react';

interface PdfHighlighterProps {}

const PdfHighlighter: React.FC<PdfHighlighterProps> = props => {
  useEffect(() => {
    console.log('mounted');
    return () => {
      console.log('Clean');
    };
  }, []);
  return <div>PdfHighlighter</div>;
};

export default PdfHighlighter;
