import React from 'react';
import { Spin, Layout, Card, Typography } from 'antd';
import {
  PdfLoader,
  PdfHighlighter,
  // Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from 'react-pdf-highlighter';

// import testHighlights from './testHighlights';
import { connect } from 'dva';
import Sidebar from './Sidebar';
import styles from './style.less';
import Tip from './Tip';

const HighlightPopup = ({ label }) => {
  if (label && label.text) {
    return (
      <div className={styles.popup}>
        <div className={styles.highlightPopup} style={{ backgroundColor: label.background_color }}>
          <Typography.Text strong>{label.text}</Typography.Text>
        </div>
        <div className={styles.arrow} style={{ borderColor: label.background_color }} />
      </div>
    );
  }
  return null;
};

const DEFAULT_URL = 'https://arxiv.org/pdf/1708.08021.pdf';

const PdfLabelingProject = connect(({ settings }) => ({
  dark: settings.navTheme === 'dark',
}))(({ labelList, annoList = [], task, handleRemoveLabel, handleAddLabel, dark, pageNumber }) => {
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

  const addHighlight = (highlight, label) => {
    const payload = {
      ...highlight,
      label: label.id,
    };
    // console.log('[DEBUG]: addHighlight -> payload', JSON.stringify(payload, null, 2));
    funcRef.current(payload);
    setActiveKey(label.id);
  };

  const updateHighlight = (highlightId, position, content) => {
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

  const scrollViewerTo = React.useRef(null);

  const resetCurrent = () => {
    setCurrentAnno(null);
  };

  const scrollToHighlightFromHash = () => {
    if (annoList) {
      const anno = annoList.find(val => val.id === currentAnno);
      if (anno) scrollViewerTo.current(anno);
    }
  };

  React.useEffect(() => {
    if (currentAnno && annoList) {
      scrollToHighlightFromHash();
    }
  }, [currentAnno]);

  const isDisabled = annoList[0] && annoList[0].finished;
  // console.log('[DEBUG]: pageNumber', pageNumber);
  console.log('[DEBUG]: activeKey', activeKey);
  return (
    <Card>
      <Layout className={styles.main}>
        <Layout.Content className={styles.content}>
          {task && (
            <PdfLoader url={task.file_url} beforeLoad={<Spin spinning />}>
              {pdfDocument => (
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={e => {
                    setEvent(e);
                    return !isDisabled && e.altKey;
                  }}
                  onScrollChange={resetCurrent}
                  scrollRef={scrollTo => {
                    scrollViewerTo.current = scrollTo;

                    scrollToHighlightFromHash();
                  }}
                  onSelectionFinished={(
                    position,
                    content,
                    hideTipAndSelection,
                    transformSelection,
                  ) => (
                    <React.Fragment>
                      {!isDisabled && (
                        <Tip
                          labelList={labelList}
                          onOpen={transformSelection}
                          onConfirm={label => {
                            if (Object.keys(label).length) {
                              addHighlight({ content, position }, label);
                              hideTipAndSelection();
                            }
                          }}
                        />
                      )}
                    </React.Fragment>
                  )}
                  highlightTransform={(
                    highlight,
                    index,
                    setTip,
                    hideTip,
                    viewportToScaled,
                    screenshot,
                    isScrolledTo,
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
                        onChange={boundingRect => {
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
                        onMouseOver={popupContent => setTip(highlight, hl => popupContent)}
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
          )}
        </Layout.Content>
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
    </Card>
  );
});

export default PdfLabelingProject;
