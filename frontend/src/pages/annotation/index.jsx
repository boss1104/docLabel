import React from 'react';
import { connect } from 'dva';
import { Layout, Spin, notification, message } from 'antd';
import { router } from 'umi';

import styles from './index.less';
import SiderList from './components/SiderList';
import TaskPagination from './components/TaskPagination';
import ProgressBar from './components/ProgressBar';
import TextClassificationProject from './components/AnnotationArea/TextClassificationProject';
import SequenceLabelingProject from './components/AnnotationArea/SequenceLabelingProject';
import Seq2seqProject from './components/AnnotationArea/Seq2seqProject';
import PdfLabelingProject from './components/AnnotationArea/PdfLabelingProject';
import { AnnotatationProvider } from './components/AnnotationContext';

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
  const [annotationValue, setAnnotationValue] = React.useState(null);

  const taskId = React.useMemo(() => Object.keys(taskList)[pageNumber], [pageNumber, taskList]);
  const hasData = currentProject && Object.keys(currentProject).length;
  const isApprover = hasData && currentProject.current_users_role.is_annotation_approver;
  const isNotApprover = hasData && !currentProject.current_users_role.is_annotation_approver;

  const queryTask = async data => {
    try {
      const q = searchQuery ? { q: searchQuery } : {};
      const res = await dispatch({
        type: 'task/fetch',
        payload: {
          params: { offset: query.offset, ...q },
          data,
        },
      });

      // Then
      const { offset: queryOffset = 0 } = query;
      const { next, previous, total } = res.pagination;

      const limitCount = next ? next.limit : total;

      setSidebarTotal(getSidebarTotal(total, limitCount));
      setSidebarPage(getSidebarPage(queryOffset, limitCount));
      if (paginationType === 'next') {
        setPageNumber(0);
      } else if (paginationType === 'prev') {
        setPageNumber(Object.keys(res.list).length - 1);
      }
      setOffset(Number(queryOffset));
      const anno = {};
      Object.entries(res.list).forEach(([key, val]) => {
        anno[key] = val.annotations;
      });
      setAnnotations(anno);
    } catch (error) {
      console.log('TCL: fetch -> error', error);
    }
  };

  React.useEffect(() => {
    if (Object.keys(currentProject).length) {
      setAnnotationValue(currentProject.users[0].id);
    }
  }, [currentProject]);

  React.useEffect(() => {
    if (isApprover && !!annotationValue) {
      queryTask({ user: annotationValue });
    } else if (isNotApprover) {
      queryTask();
    }
    return () => {
      dispatch({
        type: 'task/reset',
      });
    };
  }, [query, annotationValue]);

  React.useEffect(() => {
    const queryStatistics = async () => {
      const res = await dispatch({
        type: 'dashboard/fetchStatistics',
        payload: {
          include: 'user_progress',
          user: annotationValue,
        },
      });
      const { total, remaining: resRemaining } = res;
      setTotalTask(total);
      setRemaining(resRemaining);
    };
    queryStatistics();

    return () => {
      dispatch({
        type: 'dashboard/reset',
      });
    };
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

  /**
   * Init variables
   */

  const handleRemoveLabel = React.useCallback(
    async annotationId => {
      try {
        await dispatch({
          type: 'annotation/removeAnno',
          payload: {
            taskId,
            annotationId,
          },
        });
        const newAnno = annotations[taskId].filter(val => val.id !== Number(annotationId));
        setAnnotations({ ...annotations, [taskId]: newAnno });
      } catch (error) {
        notification.error({
          message: 'Unable to delete annotation',
          description: 'Task is already completed!',
        });
      }
    },
    [taskId, annotations],
  );

  const handleAddLabel = React.useCallback(
    async data => {
      try {
        const res = await dispatch({
          type: 'annotation/addAnno',
          payload: {
            taskId,
            data,
          },
        });
        setAnnotations({ ...annotations, [taskId]: [...annotations[taskId], res] });
        notification.success({
          message: 'Successfully added',
        });
      } catch (error) {
        notification.error({
          message: 'Unable to add new annotation',
          description: 'Task mark as completed!',
        });
        setAnnotations({ ...annotations });
      }
    },
    [taskId, annotations],
  );

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

  const handleOnSubmit = () => {
    const newAnno = { ...annotations };
    Object.keys(newAnno).forEach(key => {
      newAnno[key] = newAnno[key].map(item => ({ ...item, finished: true }));
    });
    console.log('[DEBUG]: newAnno', newAnno);
    setAnnotations(newAnno);
  };

  const handleClickApproved = React.useCallback(async () => {
    const isFinished = annotations[taskId] && annotations[taskId][0].finished;
    if (isFinished) {
      try {
        const res = await dispatch({
          type: 'annotation/markApproved',
          payload: {
            taskId,
            user: annotationValue,
            prob: 1,
          },
        });
        setAnnotations({
          ...annotations,
          [taskId]: res,
        });
        message.success('Successfully approved!');
      } catch (error) {
        console.log('[DEBUG]: error', error);
      }
    } else {
      message.warn('Annotation did not confirm yet!');
    }
  }, [taskId, annotations, annotationValue]);

  const getAnnotationArea = projectType => {
    switch (projectType) {
      case 'TextClassificationProject':
        return (
          <TextClassificationProject
            labelList={labelList}
            annoList={annotations[taskId]}
            loading={annoLoading}
            task={taskId ? taskList[taskId] : null}
            handleRemoveLabel={handleRemoveLabel}
            handleAddLabel={handleAddLabel}
          />
        );
      case 'SequenceLabelingProject':
        return (
          <SequenceLabelingProject
            labelList={labelList}
            annoList={annotations[taskId]}
            loading={annoLoading}
            task={taskId ? taskList[taskId] : null}
            handleRemoveLabel={handleRemoveLabel}
            handleAddLabel={handleAddLabel}
          />
        );

      case 'Seq2seqProject':
        return (
          <Seq2seqProject
            labelList={labelList}
            annoList={annotations[taskId]}
            loading={annoLoading}
            task={taskId ? taskList[taskId] : null}
            handleRemoveLabel={handleRemoveLabel}
            handleAddLabel={handleAddLabel}
            handleEditLabel={handleEditLabel}
          />
        );
      case 'PdfLabelingProject':
        return (
          <PdfLabelingProject
            labelList={labelList}
            annoList={annotations[taskId]}
            loading={annoLoading}
            task={taskId ? taskList[taskId] : null}
            handleRemoveLabel={handleRemoveLabel}
            handleAddLabel={handleAddLabel}
            pageNumber={pageNumber}
          />
        );
      default:
        return null;
    }
  };

  const getContext = () => ({
    isApprover,
    isNotApprover,
    annoList: annotations[taskId],
  });

  return (
    <AnnotatationProvider value={getContext()} {...props}>
      <Layout hasSider className={styles.main}>
        <SiderList
          remaining={remaining}
          onChangeKey={handleChangeKey}
          onSearchChange={handleChangeSearch}
          pageSize={sidebarTotal}
          page={sidebarPage}
          pageNumber={pageNumber}
          annotations={annotations}
          annoList={annotations[taskId]}
          onSubmit={handleOnSubmit}
          annotationValue={annotationValue}
          setAnnotationValue={setAnnotationValue}
        />
        <Layout.Content className={styles.content}>
          <Spin spinning={labelLoading || taskLoading} size="small">
            <ProgressBar
              totalTask={totalTask}
              remaining={remaining}
              onClickApproved={handleClickApproved}
              currentProject={currentProject}
              task={taskId ? taskList[taskId] : null}
            />

            {currentProject && getAnnotationArea(currentProject.project_type)}
            <TaskPagination
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              total={pagination.total}
              current={offset + pageNumber + 1}
              onPrevPagination={handlePrevPagination}
              onNextPagination={handleNextPagination}
              pagination={pagination}
            />
          </Spin>
        </Layout.Content>
      </Layout>
    </AnnotatationProvider>
  );
});

export default Annotation;
