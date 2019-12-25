/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import logo from '@/assets/logo.svg';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { Icon, message, notification, Spin } from 'antd';
import { connect } from 'dva';
import React, { useMemo, useState } from 'react';
import { Link, router } from 'umi';
import PdfLabelingProject from './components/AnnotationArea/PdfLabelingProject';
import Seq2seqProject from './components/AnnotationArea/Seq2seqProject';
import SequenceLabelingProject from './components/AnnotationArea/SequenceLabelingProject';
import TextClassificationProject from './components/AnnotationArea/TextClassificationProject';
import { AnnotatationProvider } from './components/AnnotationContext';
import ProgressBar from './components/ProgressBar';
import SiderList from './components/SiderList';
import TaskPagination from './components/TaskPagination';
import styles from './index.less';

const getSidebarTotal = (total, limit) => {
  if (total !== 0 && limit !== 0) {
    return Math.ceil(total / limit);
  }
  return 0;
};

const getSidebarPage = (offset, limit) => (limit !== 0 ? Math.ceil(offset / limit) + 1 : 0);

const defaultFooterDom = (
  <DefaultFooter
    copyright="2019 ICT"
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <Icon type="github" />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const footerRender = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

function Annotation(props) {
  const {
    dispatch,
    currentProject,
    task: { list: taskList, pagination },
    taskLoading,
    label: { list: labelList },
    labelLoading,
    location: { query },
    annoLoading,
    settings,
  } = props;

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
  const [collapsed, setCollapsed] = useState(false);

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
      if (isApprover) {
        setAnnotationValue(currentProject.users[0].id);
      }
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
      const userPayload = isApprover ? { user: annotationValue } : {};

      const res = await dispatch({
        type: 'dashboard/fetchStatistics',
        payload: {
          include: 'user_progress',
          ...userPayload,
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
      message.warn('Annotator has not confirm yet!');
    }
  }, [taskId, annotations, annotationValue]);

  const submitTaskCompleted = async () => {
    try {
      await dispatch({
        type: 'annotation/markCompleted',
      });
      message.success('Successfully submitted');
      const newAnno = { ...annotations };
      Object.keys(newAnno).forEach(key => {
        newAnno[key] = newAnno[key].map(item => ({ ...item, finished: true }));
      });
      setAnnotations(newAnno);
    } catch (error) {
      message.error('Something wrong! Try again');
    }
  };

  const getAnnotationArea = projectType => {
    switch (projectType) {
      case 'TextClassificationProject':
        return <TextClassificationProject />;
      case 'SequenceLabelingProject':
        return <SequenceLabelingProject />;
      case 'Seq2seqProject':
        return <Seq2seqProject />;
      case 'PdfLabelingProject':
        return <PdfLabelingProject />;
      default:
        return null;
    }
  };

  const getMenuDataRender = useMemo(() => {
    const tasksData = taskLoading
      ? [
          {
            key: 'loading',
            path: 'loading',
            name: 'loading',
          },
        ]
      : [
          {
            key: 'about',
            path: 'about',
            name: 'about',
          },
          ...Object.values(taskList).map((item, index) => ({
            key: `${index}`,
            path: `${item.id}`,
            name: `${item.id}`,
          })),
        ];
    return [
      {
        key: 'info',
        path: 'info',
        name: 'info',
      },
      {
        key: 'field',
        path: 'field',
        name: 'field',
      },
      ...tasksData,
    ];
  }, [taskList, taskLoading]);

  const getContext = () => ({
    isApprover,
    isNotApprover,
    annoList: annotations[taskId],
    annotations,
    taskList,
    labelList,
    task: taskId ? taskList[taskId] : null,
    annotationValue,
    setAnnotationValue,
    pagination,
    sidebarTotal,
    sidebarPage,
    remaining,
    collapsed,
    // function
    handleRemoveLabel,
    handleAddLabel,
    handleEditLabel,
  });

  return (
    <AnnotatationProvider value={{ ...props, ...getContext() }}>
      <ProLayout
        logo={logo}
        title={settings.title}
        onCollapse={$collapsed => {
          setCollapsed($collapsed);
        }}
        collapsed={collapsed}
        siderWidth={320}
        menuDataRender={() => getMenuDataRender}
        selectedKeys={[`${pageNumber}`]}
        menuItemRender={itemProps => (
          <SiderList onSubmit={submitTaskCompleted} itemProps={itemProps} />
        )}
        menuProps={{
          onClick: ({ key }) => Number.isInteger(Number(key)) && setPageNumber(Number(key)),
        }}
        menuRender={($props, dom) => {
          if (!$props.collapsed) {
            return <div className={styles.menuList}>{dom}</div>;
          }
          return <div className={styles.menuListNone}>{dom}</div>;
        }}
        links={[
          <Link to="/explore">
            <Icon type="arrow-left" /> Explore
          </Link>,
        ]}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        navTheme={settings.navTheme}
        // footerRender={footerRender}
      >
        <div className={styles.content}>
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
        </div>
      </ProLayout>
    </AnnotatationProvider>
  );
}

export default connect(({ project, task, label, loading, settings }) => ({
  currentProject: project.currentProject,
  projectLoading: loading.effects['project/fetchProject'],
  task,
  taskLoading: loading.effects['task/fetch'],
  label,
  labelLoading: loading.effects['label/fetch'],
  annoLoading: loading.models.annotation,
  settings,
  submitLoading: loading.effects['annotation/markCompleted'],
}))(Annotation);
