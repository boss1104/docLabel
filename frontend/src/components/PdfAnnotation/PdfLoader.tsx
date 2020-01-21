import pdfjs from 'pdfjs-dist';
import { useEffect, useState } from 'react';

function PdfLoader({ url, children, beforeLoad }) {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      setIsLoading(true);
      try {
        const res = await pdfjs.getDocument(url);
        setPdfDocument(res);
        setIsLoading(false);
      } catch (err) {
        console.log('[DEBUG]: fetchPdf -> err', err);
      }
    };
    fetchPdf();
  }, [url, window.innerWidth]);

  if (pdfDocument && !isLoading) {
    return children(pdfDocument);
  }

  return beforeLoad;
}

export default PdfLoader;
