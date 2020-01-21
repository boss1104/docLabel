import pdfjs from 'pdfjs-dist';
import React, { useState, useRef, useEffect, DependencyList } from 'react';

function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

type HookProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  file: string;
  onDocumentLoadSuccess?: (document: pdfjs.PDFDocumentProxy) => void;
  onDocumentLoadFail?: () => void;
  onPageLoadSuccess?: (page: pdfjs.PDFPageProxy) => void;
  onPageLoadFail?: () => void;
  onPageRenderSuccess?: (page: pdfjs.PDFPageProxy) => void;
  onPageRenderFail?: () => void;
  scale?: number;
  rotate?: number;
  page?: number;
  cMapUrl?: string;
  cMapPacked?: boolean;
  workerSrc?: string;
  withCredentials?: boolean;
};

type HookReturnValues = {
  pdfDocument: pdfjs.PDFDocumentProxy | undefined;
  pdfPage: pdfjs.PDFPageProxy | undefined;
};

export const usePdf = (
  {
    canvasRef,
    file,
    onDocumentLoadSuccess,
    onDocumentLoadFail,
    onPageLoadSuccess,
    onPageLoadFail,
    onPageRenderSuccess,
    onPageRenderFail,
    scale = 1,
    rotate = 0,
    page = 1,
    cMapUrl,
    cMapPacked,
    workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`,
    withCredentials = false,
  }: HookProps,
  deps?: DependencyList,
): HookReturnValues => {
  const [pdfDocument, setPdfDocument] = useState<pdfjs.PDFDocumentProxy>();
  const [pdfPage, setPdfPage] = useState<pdfjs.PDFPageProxy>();
  const renderTask = useRef<pdfjs.PDFRenderTask | null>(null);
  const onDocumentLoadSuccessRef = useRef(onDocumentLoadSuccess);
  const onDocumentLoadFailRef = useRef(onDocumentLoadFail);
  const onPageLoadSuccessRef = useRef(onPageLoadSuccess);
  const onPageLoadFailRef = useRef(onPageLoadFail);
  const onPageRenderSuccessRef = useRef(onPageRenderSuccess);
  const onPageRenderFailRef = useRef(onPageRenderFail);

  // assign callbacks to refs to avoid redrawing
  useEffect(() => {
    onDocumentLoadSuccessRef.current = onDocumentLoadSuccess;
  }, [onDocumentLoadSuccess]);

  useEffect(() => {
    onDocumentLoadFailRef.current = onDocumentLoadFail;
  }, [onDocumentLoadFail]);

  useEffect(() => {
    onPageLoadSuccessRef.current = onPageLoadSuccess;
  }, [onPageLoadSuccess]);

  useEffect(() => {
    onPageLoadFailRef.current = onPageLoadFail;
  }, [onPageLoadFail]);

  useEffect(() => {
    onPageRenderSuccessRef.current = onPageRenderSuccess;
  }, [onPageRenderSuccess]);

  useEffect(() => {
    onPageRenderFailRef.current = onPageRenderFail;
  }, [onPageRenderFail]);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }, [workerSrc]);

  useEffect(() => {
    const config: pdfjs.PDFSource = { url: file, withCredentials };
    if (cMapUrl) {
      config.cMapUrl = cMapUrl;
      config.cMapPacked = cMapPacked;
    }
    pdfjs.getDocument(config).promise.then(
      loadedPdfDocument => {
        setPdfDocument(loadedPdfDocument);

        if (isFunction(onDocumentLoadSuccessRef.current)) {
          onDocumentLoadSuccessRef.current(loadedPdfDocument);
        }
      },
      () => {
        if (isFunction(onDocumentLoadFailRef.current)) {
          onDocumentLoadFailRef.current();
        }
      },
    );
  }, [file, withCredentials, cMapUrl, cMapPacked, ...deps]);

  useEffect(() => {
    // draw a page of the pdf
    const drawPDF = (_page: pdfjs.PDFPageProxy) => {
      // Because this page's rotation option overwrites pdf default rotation value,
      // calculating page rotation option value from pdf default and this component prop rotate.
      const rotation = rotate === 0 ? _page.rotate : _page.rotate + rotate;
      const dpRatio = window.devicePixelRatio;
      const adjustedScale = scale * dpRatio;
      const viewport = _page.getViewport({ scale: adjustedScale, rotation });
      const canvasEl = canvasRef.current;
      if (!canvasEl) {
        return;
      }

      const canvasContext = canvasEl.getContext('2d');
      if (!canvasContext) {
        return;
      }

      canvasEl.style.width = `${viewport.width / dpRatio}px`;
      canvasEl.style.height = `${viewport.height / dpRatio}px`;
      canvasEl.height = viewport.height;
      canvasEl.width = viewport.width;

      // if previous render isn't done yet, we cancel it
      if (renderTask.current) {
        renderTask.current.cancel();
        return;
      }

      renderTask.current = _page.render({
        canvasContext,
        viewport,
      });

      renderTask.current.promise.then(
        () => {
          renderTask.current = null;

          if (isFunction(onPageRenderSuccessRef.current)) {
            onPageRenderSuccessRef.current(_page);
          }
        },
        err => {
          renderTask.current = null;

          // @ts-ignore typings are outdated
          if (err && err.name === 'RenderingCancelledException') {
            drawPDF(_page);
          } else if (isFunction(onPageRenderFailRef.current)) {
            onPageRenderFailRef.current();
          }
        },
      );
    };

    if (pdfDocument) {
      pdfDocument.getPage(page).then(
        loadedPdfPage => {
          setPdfPage(loadedPdfPage);

          if (isFunction(onPageLoadSuccessRef.current)) {
            onPageLoadSuccessRef.current(loadedPdfPage);
          }

          drawPDF(loadedPdfPage);
        },
        () => {
          if (isFunction(onPageLoadFailRef.current)) {
            onPageLoadFailRef.current();
          }
        },
      );
    }
  }, [canvasRef, page, pdfDocument, rotate, scale, ...deps]);

  return { pdfDocument, pdfPage };
};
