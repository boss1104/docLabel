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
import Sidebar from './Sidebar';
import styles from './style.less';
import Tip from './Tip';

const HighlightPopup = ({ label }) => {
  // console.log('[DEBUG]: HighlightPopup -> label', label);
  if (label && label.text) {
    return (
      <div className={styles.popup}>
        <div className={styles.highlightPopup} style={{ color: label.background_color }}>
          <Typography.Text strong>{label.text}</Typography.Text>
        </div>
        <div className={styles.compactArrow} />
      </div>
    );
  }
  return null;
};

const DEFAULT_URL = 'https://arxiv.org/pdf/1708.08021.pdf';

function PdfLabelingProject({
  labelList,
  annoList,
  loading,
  task,
  handleRemoveLabel,
  handleAddLabel,
}) {
  const [activeKey, setActiveKey] = React.useState('');
  const [currentAnno, setCurrentAnno] = React.useState(null);

  React.useEffect(() => {
    setActiveKey(Object.keys(labelList)[0]);
  }, [labelList]);

  /**
   * Handlers
   */

  const addHighlight = (highlight, label) => {
    const payload = {
      ...highlight,
      label: label.id,
    };
    // console.log('[DEBUG]: addHighlight -> payload', JSON.stringify(payload, null, 2));
    handleAddLabel(payload);
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
    const anno = annoList.find(val => val.id === currentAnno);
    if (anno) {
      scrollViewerTo.current(anno);
    }
  };

  React.useEffect(() => {
    if (currentAnno) {
      scrollToHighlightFromHash();
    }
  }, [currentAnno]);

  return (
    <Card>
      <Layout>
        <Layout.Content className={styles.content}>
          {task && (
            <PdfLoader url={task.file_url} beforeLoad={<Spin spinning />}>
              {pdfDocument => (
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={event => event.altKey}
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
        />
      </Layout>
    </Card>
  );
}

export default PdfLabelingProject;