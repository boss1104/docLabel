import React from 'react';
import { DoubleLeftOutlined, DoubleRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Pagination, Card, Row, Col } from 'antd';

function TaskPagination({
  onNextPage,
  onPrevPage,
  total,
  current,
  pagination,
  onNextPagination,
  onPrevPagination,
}) {
  const PageButton = props => <Button size="large" type="default" {...props}></Button>;
  return (
    <Card>
      <Row type="flex" justify="center" gutter={[16, 0]}>
        <Col>
          <PageButton
            title="Previous Page"
            disabled={!pagination.previous}
            onClick={onPrevPagination}
          >
            <DoubleLeftOutlined />
          </PageButton>
        </Col>
        <Col>
          <Pagination
            simple
            current={current}
            defaultPageSize={1}
            total={total}
            itemRender={(page, type, originalElement) => {
              if (type === 'next') {
                return (
                  <PageButton title="Next Task" disabled={current === total} onClick={onNextPage}>
                    <RightOutlined />
                  </PageButton>
                );
              }
              if (type === 'prev') {
                return (
                  <PageButton title="Previous Task" disabled={current === 1} onClick={onPrevPage}>
                    <LeftOutlined />
                  </PageButton>
                );
              }
              return originalElement;
            }}
          />
        </Col>
        <Col>
          <PageButton title="Next Page" disabled={!pagination.next} onClick={onNextPagination}>
            <DoubleRightOutlined />
          </PageButton>
        </Col>
      </Row>
    </Card>
  );
}
export default TaskPagination;
