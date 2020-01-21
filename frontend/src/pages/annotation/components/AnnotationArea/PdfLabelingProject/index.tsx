import PdfLoader from '@/components/PdfAnnotation/PdfLoader';
import { ConnectProps, ConnectState, Label } from '@/models/connect';
import { Layout, Spin, Typography } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { AreaHighlight, Highlight, PdfHighlighter, Popup } from 'react-pdf-highlighter';
import { useAnnotaionContext } from '../../AnnotationContext';
import Sidebar from './Sidebar';
import styles from './style.less';
import Tip from './Tip';

const HighlightPopup: React.SFC<{ label: Label }> = ({ label }) => {
  if (label && label.text) {
    return (
      <div className={styles.popup}>
        <div className={styles.highlightPopup} style={{ backgroundColor: label.background_color }}>
          <Typography.Text strong style={{ color: label.text_color }}>
            {label.text}
          </Typography.Text>
        </div>
        <div className={styles.arrow} style={{ borderColor: label.background_color }} />
      </div>
    );
  }
  return null;
};

interface PdfLabelingProjectProps extends ConnectProps {
  dark: boolean;
}

const PdfLabelingProject: React.FC<PdfLabelingProjectProps> = ({ dark }) => {
  const {
    labelList,
    annoList = [],
    task,
    handleRemoveLabel,
    handleAddLabel,
    isDisabled,
  } = useAnnotaionContext();
  const [activeKey, setActiveKey] = React.useState('');
  const [currentAnno, setCurrentAnno] = React.useState(null);

  const funcRef = React.useRef(handleAddLabel);

  React.useEffect(() => {
    setActiveKey(Object.keys(labelList)[0]);
  }, [labelList]);

  const [event, setEvent] = React.useState(null);

  React.useEffect(() => {
    funcRef.current = handleAddLabel;
  }, [event]);
  /**
   * Handlers
   */

  const addHighlight = (highlight: any, label: any) => {
    const payload = {
      ...highlight,
      label: label.id,
    };
    // console.log('[DEBUG]: addHighlight -> payload', JSON.stringify(payload, null, 2));
    funcRef.current(payload);
    setActiveKey(label.id);
  };

  const updateHighlight = (highlightId: any, position: any, content: any) => {
    console.log('Updating highlight', highlightId, position, content);

    // setHighlights(
    //   highlights.map(h => {
    //     if (h.id === highlightId) {
    //       return {
    //         ...h,
    //         position: { ...h.position, ...position },
    //         content: { ...h.content, ...content },
    //       };
    //     }
    //     return h;
    //   }),
    // );
  };

  const scrollViewerTo = React.useRef<any>(null);

  const resetCurrent = () => {
    setCurrentAnno(null);
  };

  const scrollToHighlightFromHash = () => {
    if (annoList) {
      const anno = annoList.find(val => val.id === currentAnno);
      if (anno) scrollViewerTo.current(anno);
    }
  };

  useEffect(() => {
    if (currentAnno && annoList) {
      scrollToHighlightFromHash();
    }
  }, [currentAnno]);

  const getContent = () => {
    if (!task || !task.file_url) {
      return null;
    }
    return (
      <PdfLoader
        url={task.file_url}
        beforeLoad={
          <div className={styles.loading}>
            <Spin spinning />
          </div>
        }
      >
        {(pdfDocument: any) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(e: any) => {
              setEvent(e);
              return !isDisabled && e.altKey;
            }}
            onScrollChange={resetCurrent}
            scrollRef={(scrollTo: any) => {
              scrollViewerTo.current = scrollTo;

              scrollToHighlightFromHash();
            }}
            onSelectionFinished={(
              position: any,
              content: any,
              hideTipAndSelection: any,
              transformSelection: any,
            ) => (
              <React.Fragment>
                {!isDisabled && (
                  <Tip
                    labelList={labelList}
                    onOpen={transformSelection}
                    onConfirm={(label: any, comment: any) => {
                      const contentMod = { ...content, comment };
                      if (Object.keys(label).length) {
                        addHighlight({ content: contentMod, position }, label);
                        hideTipAndSelection();
                      }
                    }}
                  />
                )}
              </React.Fragment>
            )}
            highlightTransform={(
              highlight: any,
              index: any,
              setTip: any,
              hideTip: any,
              viewportToScaled: any,
              screenshot: any,
              isScrolledTo: any,
            ) => {
              const isTextHighlight = !(highlight.content && highlight.content.image);

              const component = isTextHighlight ? (
                <Highlight
                  isScrolledTo={isScrolledTo}
                  position={highlight.position}
                  comment={highlight.label}
                />
              ) : (
                <AreaHighlight
                  highlight={highlight}
                  onChange={(boundingRect: any) => {
                    updateHighlight(
                      highlight.id,
                      { boundingRect: viewportToScaled(boundingRect) },
                      { image: screenshot(boundingRect) },
                    );
                  }}
                />
              );
              return (
                <Popup
                  popupContent={<HighlightPopup label={labelList[highlight.label]} />}
                  onFocus={() => {}}
                  onBlur={() => {}}
                  onMouseOver={(popupContent: any) => setTip(highlight, hl => popupContent)}
                  onMouseOut={hideTip}
                  key={index}
                >
                  {component}
                </Popup>
              );
            }}
            highlights={annoList}
          />
        )}
      </PdfLoader>
    );
  };

  return (
    <Layout className={styles.main}>
      <Layout className={styles.content}>
        <Layout.Content>{getContent()}</Layout.Content>
      </Layout>
      <Sidebar
        annoList={annoList}
        labelList={labelList}
        handleRemoveLabel={handleRemoveLabel}
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        setCurrentAnno={setCurrentAnno}
        dark={dark}
        isDisabled={isDisabled}
      />
    </Layout>
  );
};

export default connect(({ settings }: ConnectState) => ({
  dark: settings.navTheme === 'dark',
}))(PdfLabelingProject);
