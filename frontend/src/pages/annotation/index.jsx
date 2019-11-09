/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { connect } from 'dva';
import { Layout, Button, Row, Col, Progress, Card, Tag, Typography, Spin, Icon } from 'antd';
import { useLogger, useSetState } from 'react-use';
import { router } from 'umi';

import styles from './index.less';
import LabelPreview from './components/LabelPreview';
import SiderList from './components/SiderList';
import TaskPagination from './components/TaskPagination';

const { Content } = Layout;
const pageSize = 4;

const getSidebarTotal = (total, limit) => {
  if (total !== 0 && limit !== 0) {
    return Math.ceil(total / limit);
  }
  return 0;
};

const getSidebarPage = (offset, limit) => (limit !== 0 ? Math.ceil(offset / limit) + 1 : 0);

const Annotation = connect(({ project, task, label, loading }) => ({
  project,
  task,
  taskLoading: loading.effects['task/fetch'],
  label,
  labelLoading: loading.effects['label/fetch'],
}))(props => {
  const {
    dispatch,
    project: { currentProject },
    task: { list: taskList, pagination },
    taskLoading,
    label: { list: labelList },
    labelLoading,
    location: { query },
  } = props;
  // useLogger('Annotation', taskLoading);

  /**
   * States
   */
  const [{ searchQuery, annotations, collapsed, selectedKeys }, setState] = useSetState({
    searchQuery: '',
    annotations: [],
    collapsed: false,
    selectedKeys: [],
  });

  const [sidebarTotal, setSidebarTotal] = React.useState(0);
  const [sidebarPage, setSidebarPage] = React.useState(0);
  const [paginationType, setPaginationType] = React.useState('next');
  const [pageNumber, setPageNumber] = React.useState(0);

  const getLimitFromNext = next => {};

  /**
   * Constructor
   */

  const queryLabel = async () => {
    await dispatch({
      type: 'label/fetch',
    });
  };

  const queryTask = async () => {
    try {
      const q = searchQuery ? { q: searchQuery } : {};
      const res = await dispatch({
        type: 'task/fetch',
        payload: { params: { offset: query.offset, ...q } },
      });

      // Then

      const { offset = 0, limit } = query;
      const { next, previous, total } = res.pagination;

      const limitCount = next || limit ? query.limit : total;

      setSidebarTotal(getSidebarTotal(total, limitCount));
      setSidebarPage(getSidebarPage(offset, limitCount));

      if (paginationType === 'next') {
        setPageNumber(0);
      } else if (paginationType === 'prev') {
        setPageNumber(Object.keys(res.list).length - 1);
      }
      // setState({
      //   selectedKeys: [Object.keys(res.list)[pageNumber]],
      // });
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

  const getColor = text => {
    // const labelColor = labelsList.find(l => l.text === text);
    // return labelColor.background_color;
  };

  const handleChangeKey = key => {
    // setSelectedKeys([key]);
  };

  const handleChangeSearch = value => {
    // setSearchQuery(value);
  };

  const handleNextPagination = async () => {
    console.log('[DEBUG]: handleNextPagination -> handleNextPagination');
    const { next } = pagination;
    if (next) {
      queryTask();
      setPageNumber(0);
    } else {
      setPageNumber(Object.keys(taskList).length - 1);
    }
    // resetScrollbar();
  };

  const handlePrevPagination = async () => {
    console.log('[DEBUG]: handlePrevPagination -> handlePrevPagination');
    const { previous } = pagination;

    if (previous) {
      queryTask();
      setPageNumber(Object.keys(taskList).length - previous.limit);
    } else {
      setPageNumber(0);
    }
    // resetScrollbar();
  };

  const handleNextPage = async () => {
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
      // this.resetScrollbar();
    }
  };

  const handlePrevPage = async () => {
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
  };

  /**
   * Init variables
   */

  return (
    <div className={styles.main}>
      <Layout>
        <SiderList
          // collapsed={collapsed}
          onChangeKey={handleChangeKey}
          selectedKeys={selectedKeys}
          onSearchChange={handleChangeSearch}
          pageSize={sidebarTotal}
          page={sidebarPage}
        />
        <Layout>
          <Spin spinning={labelLoading || taskLoading} size="small">
            <Content className={styles.content}>
              <Card>
                <Row type="flex" gutter={24}>
                  <Col span={2}>Progress:</Col>
                  <Col span={8}>
                    <Progress percent={50} status="active" strokeColor="#00a854" strokeWidth={15} />
                  </Col>
                  <Col span={14}>
                    <Row type="flex" gutter={48} justify="end">
                      <Col>
                        <Button type="primary" icon="download" size="large" />
                      </Col>
                      <Col>
                        <Button type="primary" icon="download" size="large" />
                      </Col>
                      <Col>
                        <Button type="primary" icon="download" size="large" />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
              <Card>
                <Row type="flex">
                  <Col span={2}>Labels: </Col>
                  <Col span={22}>
                    <Row type="flex" gutter={[24, 16]}>
                      {labelList &&
                        Object.keys(labelList).map(key => (
                          <Col>
                            <LabelPreview key={key} label={labelList[key]} onClick={() => {}} />
                          </Col>
                        ))}
                    </Row>
                  </Col>
                </Row>
              </Card>
              <Card>
                <Row type="flex">
                  <Col span={2}>Classification: </Col>
                  <Col span={22}>
                    {annotations.length !== 0 &&
                      annotations.map(val => (
                        <Tag
                          key={val}
                          color={getColor(val)}
                          closable
                          onClose={() => {
                            // const tags = chosenLabels.filter(tag => tag !== val);
                            // setChosenLabels(tags);
                          }}
                        >
                          <span>{val}</span>
                        </Tag>
                      ))}
                    {!(annotations.length !== 0) && <span>None</span>}
                  </Col>
                </Row>
              </Card>
              <Card>
                <Row type="flex" justify="center">
                  <Col>
                    {Object.keys(taskList)[pageNumber] && (
                      <Typography.Title level={3}>
                        {taskList[Object.keys(taskList)[pageNumber]].text}
                      </Typography.Title>
                    )}
                  </Col>
                </Row>
              </Card>
              <Card>
                <Row type="flex" justify="center">
                  <Col>
                    <TaskPagination
                      onNextPage={handleNextPage}
                      onPrevPage={handlePrevPage}
                      total={pagination.total}
                      current={
                        query.offset ? Number(query.offset) + pageNumber + 1 : pageNumber + 1
                      }
                    />
                  </Col>
                </Row>
              </Card>
            </Content>
          </Spin>
        </Layout>
      </Layout>
    </div>
  );
});

export default Annotation;
