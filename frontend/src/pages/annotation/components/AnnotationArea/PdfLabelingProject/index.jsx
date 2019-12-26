import PdfLoader from '@/components/PdfAnnotation/PdfLoader';
import { Layout, Spin, Typography } from 'antd';
import { connect } from 'dva';
import React, { useContext } from 'react';
import { AreaHighlight, Highlight, PdfHighlighter, Popup } from 'react-pdf-highlighter';
import { AnnotatationContext } from '../../AnnotationContext';
import Sidebar from './Sidebar';
import styles from './style.less';
import Tip from './Tip';

const HighlightPopup = ({ label }) => {
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

function PdfLabelingProject({ dark }) {
  const {
    labelList,
    annoList = [],
    annoLoading: loading,
    task,
    handleRemoveLabel,
    handleAddLabel,
  } = useContext(AnnotatationContext);
  const [activeKey, setActiveKey] = React.useState('');
  const [currentAnno, setCurrentAnno] = React.useState(null);
  const { isDisabled } = React.useContext(AnnotatationContext);

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

  return (
    <Layout className={styles.main}>
      <Layout className={styles.content}>
        <Layout.Content>
          {task && (
            <PdfLoader
              url={task.file_url}
              beforeLoad={
                <div className={styles.loading}>
                  <Spin spinning />
                </div>
              }
            >
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
                          onConfirm={(label, comment) => {
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
}

export default connect(({ settings }) => ({
  dark: settings.navTheme === 'dark',
}))(PdfLabelingProject);
