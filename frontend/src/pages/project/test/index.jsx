import React, { Component } from 'react';
import { connect } from 'dva';
import { Annotator, Action } from 'poplar-annotation';
import { List, Radio, Tooltip, Button } from 'antd';
// import { equals } from '@cbd/utils';
import EntityCrudModal from './components/modal/entityModal/EntityCrudModal';
import ConnectionModal from './components/modal/connectionModal/ConnectionModal';
import ConnectionCrudModal from './components/modal/connectionModal/ConnectionCrudModal';
import ProjectModal from './components/projectModal/ProjectModal';
import styles from './index.less';

const equals = (a1, a2) => JSON.stringify(a1) === JSON.stringify(a2);

@connect(stores => ({
  manualAnnotationDetail: stores.manualAnnotationDetail,
  public: stores.public,
}))
class ManualAnnotation extends Component {
  state = {
    selectedLabelCategoryId: null,
    sentenceId: 0,
    EntityCrudModalVisible: false,
    ProjectModalVisible: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      manualAnnotationDetail: {
        labelCategories: prevLabelCategories = [],
        connectionCategories: prevConnectionCategories = [],
      } = {},
    } = prevProps;
    const {
      manualAnnotationDetail: { labelCategories = [], connectionCategories = [] } = {},
    } = this.props;
    // Listen to entity set list changes and update
    if (!equals(prevLabelCategories, labelCategories)) {
      (labelCategories || []).forEach(item => {
        if (this.annotator) {
          this.annotator.store.labelCategoryRepo.add({
            id: item.labelId,
            borderColor: item.bordercolor,
            text: item.text,
            color: item.color,
          });
        }
      });
    }
    // Listen for relationship list changes and update
    if (!equals(prevConnectionCategories, connectionCategories)) {
      (connectionCategories || []).forEach(item => {
        if (this.annotator) {
          this.annotator.store.connectionCategoryRepo.add({
            id: item.connectionId,
            text: item.text,
          });
        }
      });
    }
  }

  // Read the annotation data and initialize the label area
  loadAnnotator = async (sentenceObj = {}) => {
    const { dispatch, manualAnnotationDetail: { projectId } = {} } = this.props;
    const { content = '', sentenceId } = sentenceObj;
    this.setState({ sentenceId });
    const { labels = [], connections = [] } = await dispatch({
      type: 'manualAnnotationDetail/queryAnnotation',
      payload: { projectId, sentenceId },
    });
    this.initAnnotator({
      content,
      labels: labels.map(item => ({
        id: item.labelId,
        categoryId: item.categoryId,
        startIndex: item.startIndex,
        endIndex: item.endIndex,
      })),
      connections: connections.map(item => ({
        id: item.connectionlId,
        categoryId: item.categoryId,
        fromId: item.fromId,
        toId: item.toId,
      })),
    });
  };

  // Initialize the label area
  initAnnotator = (stringObj = {}) => {
    const {
      manualAnnotationDetail: { labelCategories = [], connectionCategories = [] } = {},
      public: { roleLevel = 3 } = {},
    } = this.props;
    const originString = {
      content: '',
      labelCategories: labelCategories.map(item => ({
        id: item.labelId,
        borderColor: item.bordercolor,
        text: item.text,
        color: item.color,
      })),
      labels: [],
      connectionCategories: connectionCategories.map(item => ({
        id: item.connectionId,
        text: item.text,
      })),
      connections: [],
      ...stringObj,
    };
    if (this.annotator) this.annotator.remove();

    this.annotator = new Annotator(originString, document.getElementById('AnnotationArea'), {
      allowMultipleLabel: false,
      maxLineWidth: 30,
    });

    if (roleLevel >= 2) {
      // Label New
      this.annotator.on('textSelected', (startIndex, endIndex) => {
        // Get the LabelCategoryId that the user wants to add
        const { selectedLabelCategoryId } = this.state;
        console.log('selectedLabelCategoryId', selectedLabelCategoryId);
        if (selectedLabelCategoryId) {
          this.annotator.applyAction(
            Action.Label.Create(selectedLabelCategoryId, startIndex, endIndex),
          );
        }
      });
      // Label delete
      this.annotator.on('labelRightClicked', (id, x, y) => {
        // Output the ID of the label clicked by the user, and the X, Y value of the mouse when clicked
        this.annotator.applyAction(Action.Label.Delete(id));
      });
      // Connection added
      this.annotator.on('twoLabelsClicked', (startIndex, endIndex) => {
        // Get the ConnectionCategoryId that the user wants to add
        this.setState({ ConnectionModalVisible: true, startIndex, endIndex });
        // this.annotator.applyAction(
        //   Action.Connection.Create(id, startIndex, endIndex)
        // );
      });
      // Connection delete
      this.annotator.on('connectionRightClicked', (id, x, y) => {
        // Output the ID of the Connection that the user clicked, and the X, Y value of the mouse when clicked.
        this.annotator.applyAction(Action.Connection.Delete(id));
      });
    }
  };

  resetAnnotator = (sentenceObj = {}) => {
    const { content = '' } = sentenceObj;
    this.initAnnotator({ content });
  };

  render() {
    const {
      dispatch,
      manualAnnotationDetail: {
        projectId,
        projectName,
        sentencesList = [],
        labelCategories = [],
      } = {},
      public: { roleLevel } = {},
    } = this.props;
    const {
      EntityCrudModalVisible,
      ConnectionCrudModalVisible,
      ConnectionModalVisible,
      sentenceId,
      ProjectModalVisible,
    } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.sidebar}>
          <section>
            <ProjectModal
              visible={ProjectModalVisible}
              onCancel={() => {
                this.setState({ ProjectModalVisible: false });
              }}
              annotationInit={sentenceObj => {
                this.loadAnnotator(sentenceObj);
              }}
            />
            <h3 className={styles.subtitle}>
              Project Info
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ ProjectModalVisible: true });
                }}
              >
                Select
              </Button>
            </h3>
            <div className={`${styles.subitem} ${styles.margin}`}>
              <div className={styles.key}>File name</div>
              {projectName}
            </div>
            <div className={`${styles.subitem} ${styles.margin}`}>
              <div className={styles.key}>Entity set</div>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ EntityCrudModalVisible: true });
                }}
              >
                Edit
              </Button>
              <EntityCrudModal
                visible={EntityCrudModalVisible}
                onCancel={() => {
                  this.setState({ EntityCrudModalVisible: false });
                }}
              />
            </div>
            <div className={`${styles.subitem} ${styles.margin}`}>
              <div className={styles.key}>Relationship set</div>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ ConnectionCrudModalVisible: true });
                }}
              >
                Edit
              </Button>
              <ConnectionModal
                visible={ConnectionModalVisible}
                onCancel={() => {
                  this.setState({ ConnectionModalVisible: false });
                }}
                onOk={ConnectionCategoryId => {
                  this.annotator.applyAction(
                    Action.Connection.Create(
                      ConnectionCategoryId,
                      this.state.startIndex,
                      this.state.endIndex,
                    ),
                  );
                }}
              />
              <ConnectionCrudModal
                visible={ConnectionCrudModalVisible}
                onCancel={() => {
                  this.setState({ ConnectionCrudModalVisible: false });
                }}
              />
            </div>
            <div className={`${styles.subitem} ${styles.margin}`}>
              <div className={styles.key}>Export data</div>
              <Button type="primary">
                <a href={`/api/manual/exportTxt?projectId=${projectId}`}>.txt</a>
              </Button>
              <Button type="primary">
                <a href={`/api/manual/exportCsv?projectId=${projectId}`}>.csv</a>
              </Button>
            </div>
          </section>
          <section>
            <h3 className={styles.subtitle}>schedule</h3>
            <div className={styles.subitem}>
              <div className={styles.key}>Labeled</div>
              {sentencesList.filter(item => item.labeled).length}
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>Total</div>
              {sentencesList.length}
            </div>
            <div className={styles.subitem}>
              <div className={styles.key}>
                <progress
                  value={
                    sentencesList.length > 0
                      ? (sentencesList.filter(item => item.labeled).length / sentencesList.length) *
                        100
                      : 100
                  }
                  max="100"
                />
              </div>
              {(sentencesList.length > 0
                ? (sentencesList.filter(item => item.labeled).length / sentencesList.length) * 100
                : 100
              ).toFixed(1)}
              %
            </div>
          </section>
          <section>
            <h3 className={styles.subtitle}>Sentence list</h3>
            <List
              dataSource={sentencesList}
              renderItem={(item, index) => (
                <div className={styles.subitem}>
                  <Tooltip placement="left" title={item.content}>
                    <List.Item
                      onClick={() => {
                        if (this.annotator) this.annotator.remove();
                        this.loadAnnotator(item);
                      }}
                    >
                      {`${index + 1}.${item.content}`}
                    </List.Item>
                  </Tooltip>
                </div>
              )}
            />
          </section>
        </div>
        <div className={styles.right}>
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles.entities}>
                <Radio.Group
                  buttonStyle="solid"
                  onChange={e => {
                    this.setState({ selectedLabelCategoryId: e.target.value });
                  }}
                >
                  {(labelCategories || []).map(item => (
                    <Radio.Button value={item.labelId} key={item.labelId}>
                      {item.text}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
              <div className={styles.text} id="AnnotationArea" />
            </div>
            <div className={styles.meta}>
              <span>
                <strong>Source:</strong>
                xxxxxxxxxxx
              </span>
            </div>
          </div>
          {roleLevel >= 2 && (
            <footer className={styles.footer}>
              <button
                type="button"
                onClick={() => {
                  const { labels = [], connections = [] } = this.annotator.store.json;
                  dispatch({
                    type: 'manualAnnotationDetail/saveAnnotation',
                    payload: {
                      projectId,
                      sentenceId,
                      labels,
                      connections,
                    },
                  }).then(errCode => {
                    if (!errCode) {
                      dispatch({
                        type: 'manualAnnotationDetail/querySentencesList',
                        payload: projectId,
                      }).then(res => {
                        if (res) {
                          this.loadAnnotator(
                            res.find(item => !item.labeled && item.sentenceId !== sentenceId),
                          );
                        }
                      });
                    }
                  });
                }}
                style={{ background: '#4fd364' }}
              >
                <svg
                  aria-hidden="true"
                  fill="currentColor"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.172l10.594-10.594 1.406 1.406-12 12-5.578-5.578 1.406-1.406z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  const { content } = this.annotator.store.json;
                  this.resetAnnotator({ content });
                }}
                style={{ background: '#f74c4a' }}
              >
                <svg
                  aria-hidden="true"
                  fill="currentColor"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z" />
                </svg>
              </button>
            </footer>
          )}
        </div>
      </div>
    );
  }
}

export default ManualAnnotation;
