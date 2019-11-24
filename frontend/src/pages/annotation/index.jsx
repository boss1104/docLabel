import React from 'react';
import { connect } from 'dva';
import { Layout, Button, Row, Col, Progress, Card, Spin, Icon, Modal, Typography } from 'antd';
import { router } from 'umi';
import { GridContent } from '@ant-design/pro-layout';

import styles from './index.less';
import SiderList from './components/SiderList';
import TaskPagination from './components/TaskPagination';
import ProgressBar from './components/ProgressBar';
import TextClassificationProject from './components/AnnotationArea/TextClassificationProject';
import SequenceLabelingProject from './components/AnnotationArea/SequenceLabelingProject';
import Seq2seqProject from './components/AnnotationArea/Seq2seqProject';
import PdfLabelingProject from './components/AnnotationArea/PdfLabelingProject';

const getSidebarTotal = (total, limit) => {
  if (total !== 0 && limit !== 0) {
    return Math.ceil(total / limit);
  }
  return 0;
};

const getSidebarPage = (offset, limit) => (limit !== 0 ? Math.ceil(offset / limit) + 1 : 0);

const Annotation = connect(({ project, task, label, loading }) => ({
  currentProject: project.currentProject,
  task,
  taskLoading: loading.effects['task/fetch'],
  label,
  labelLoading: loading.effects['label/fetch'],
  annoLoading: loading.models.annotation,
}))(props => {
  const {
    dispatch,
    currentProject,
    task: { list: taskList, pagination },
    taskLoading,
    label: { list: labelList },
    labelLoading,
    location: { query },
    annoLoading,
  } = props;

  /**
   * States
   */

  const [collapsed, setCollapsed] = React.useState(false);
  const [annotations, setAnnotations] = React.useState({});
  const [sidebarTotal, setSidebarTotal] = React.useState(0);
  const [sidebarPage, setSidebarPage] = React.useState(0);
  const [paginationType, setPaginationType] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [pageNumber, setPageNumber] = React.useState(0);
  const [offset, setOffset] = React.useState(0);
  // Statistics
  const [totalTask, setTotalTask] = React.useState(0);
  const [remaining, setRemaining] = React.useState(0);

  /**
   * Handler
   */
  const queryLabel = async () => {
    const res = await dispatch({
      type: 'label/fetch',
    });
  };

  const queryTask = async () => {
    try {
      const q = searchQuery ? { q: searchQuery } : {};
      // doc_annotations__isnull=${state}
      const res = await dispatch({
        type: 'task/fetch',
        payload: { params: { offset: query.offset, ...q } },
      });
      const anno = {};
      Object.entries(res.list).forEach(([key, val]) => {
        anno[key] = val.annotations;
      });
      // console.log('[DEBUG]: queryTask -> anno', anno);
      // Then
      const { offset: queryOffset = 0 } = query;
      const { next, previous, total } = res.pagination;
      console.log('[DEBUG]: queryTask -> next', next);

      const limitCount = next ? next.limit : total;

      setSidebarTotal(getSidebarTotal(total, limitCount));
      setSidebarPage(getSidebarPage(queryOffset, limitCount));
      setAnnotations(anno);
      if (paginationType === 'next') {
        setPageNumber(0);
      } else if (paginationType === 'prev') {
        setPageNumber(Object.keys(res.list).length - 1);
      }
      setOffset(Number(queryOffset));
    } catch (error) {
      console.log('TCL: fetch -> error', error);
    }
  };

  React.useEffect(() => {
    // Fetch guideline
    queryLabel();
  }, []);

  React.useEffect(() => {
    queryTask();
  }, [query]);

  React.useEffect(() => {
    const queryStatistics = async () => {
      const res = await dispatch({
        type: 'dashboard/fetchStatistics',
      });
      const { total, remaining: resRemaining } = res;
      setTotalTask(total);
      setRemaining(resRemaining);
    };
    queryStatistics();
  }, [annotations]);

  const handleChangeKey = key => {
    setPageNumber(Number(key));
  };

  const handleChangeSearch = value => {
    setSearchQuery(value);
  };

  const handleNextPagination = () => {
    const { next } = pagination;
    if (next) {
      setPaginationType('next');
      router.push({
        query: next,
      });
    }
    // resetScrollbar();
  };

  const handlePrevPagination = () => {
    const { previous } = pagination;
    if (previous) {
      setPaginationType('next');
      router.push({
        query: previous,
      });
    }
    // resetScrollbar();
  };

  const handleNextPage = () => {
    const page = pageNumber + 1;
    const { length } = Object.keys(taskList);
    const { next } = pagination;
    if (page === length) {
      if (next) {
        setPaginationType('next');
        router.push({
          query: next,
        });
      } else {
        setPageNumber(length - 1);
      }
    } else {
      setPageNumber(page);
      // resetScrollbar()
    }
  };

  const handlePrevPage = () => {
    const page = pageNumber - 1;
    const { previous } = pagination;
    if (page === -1) {
      if (previous) {
        setPaginationType('prev');
        router.push({
          query: previous,
        });
      } else {
        setPageNumber(0);
      }
    } else {
      setPageNumber(page);
    }
    // resetScrollbar();
  };
  const taskId = React.useMemo(() => Object.keys(taskList)[pageNumber], [pageNumber, taskList]);

  // console.log('[DEBUG]: taskId', taskId);
  /**
   * Init variables
   */

  const handleRemoveLabel = async annotationId => {
    const res = await dispatch({
      type: 'annotation/removeAnno',
      payload: {
        taskId,
        annotationId,
      },
    });
    const newAnno = annotations[taskId].filter(val => val.id !== Number(annotationId));
    setAnnotations({ ...annotations, [taskId]: newAnno });
  };

  const handleAddLabel = async data => {
    const res = await dispatch({
      type: 'annotation/addAnno',
      payload: {
        taskId,
        data,
      },
    });
    setAnnotations({ ...annotations, [taskId]: [...annotations[taskId], res] });
  };

  const handleEditLabel = async (annotationId, data) => {
    const res = await dispatch({
      type: 'annotation/editAnno',
      payload: {
        taskId,
        annotationId,
        data,
      },
    });
    const newAnno = annotations[taskId].map(val => (res.id !== val.id ? val : res));
    setAnnotations({ ...annotations, [taskId]: newAnno });
  };

  const AnnotationArea = {
    TextClassificationProject: (
      <TextClassificationProject
        labelList={labelList}
        annoList={annotations[taskId]}
        loading={annoLoading}
        task={taskId ? taskList[taskId] : null}
        handleRemoveLabel={handleRemoveLabel}
        handleAddLabel={handleAddLabel}
      />
    ),
    SequenceLabelingProject: (
      <SequenceLabelingProject
        labelList={labelList}
        annoList={annotations[taskId]}
        loading={annoLoading}
        task={taskId ? taskList[taskId] : null}
        handleRemoveLabel={handleRemoveLabel}
        handleAddLabel={handleAddLabel}
      />
    ),
    Seq2seqProject: (
      <Seq2seqProject
        labelList={labelList}
        annoList={annotations[taskId]}
        loading={annoLoading}
        task={taskId ? taskList[taskId] : null}
        handleRemoveLabel={handleRemoveLabel}
        handleAddLabel={handleAddLabel}
        handleEditLabel={handleEditLabel}
      />
    ),
    PdfLabelingProject: (
      <PdfLabelingProject
        labelList={labelList}
        annoList={annotations[taskId]}
        loading={annoLoading}
        task={taskId ? taskList[taskId] : null}
        handleRemoveLabel={handleRemoveLabel}
        handleAddLabel={handleAddLabel}
      />
    ),
  };
  /**
   * Variables
   */

  return (
    <GridContent>
      <div className={styles.main}>
        <Layout>
          <SiderList
            // collapsed={collapsed}
            onChangeKey={handleChangeKey}
            onSearchChange={handleChangeSearch}
            pageSize={sidebarTotal}
            page={sidebarPage}
            pageNumber={pageNumber}
            annotations={annotations}
          />
          <Layout style={{ marginLeft: 320 }}>
            <Spin spinning={labelLoading || taskLoading} size="small">
              <Layout.Content className={styles.content}>
                <ProgressBar
                  totalTask={totalTask}
                  remaining={remaining}
                  currentProject={currentProject}
                />
                {currentProject && AnnotationArea[currentProject.project_type]}
                <TaskPagination
                  onNextPage={handleNextPage}
                  onPrevPage={handlePrevPage}
                  total={pagination.total}
                  current={offset + pageNumber + 1}
                  onPrevPagination={handlePrevPagination}
                  onNextPagination={handleNextPagination}
                  pagination={pagination}
                />
              </Layout.Content>
            </Spin>
          </Layout>
        </Layout>
      </div>
    </GridContent>
  );
});

export default Annotation;
