import React from 'react';
import { Button, Pagination, Icon, Card, Row, Col } from 'antd';

function TaskPagination({
  onNextPage,
  onPrevPage,
  total,
  current,
  pagination,
  onNextPagination,
  onPrevPagination,
}) {
  return (
    <Card>
      <Row type="flex" justify="center">
        <Col>
          <Button
            title="Previous Page"
            size="large"
            type="default"
            style={{ margin: '0 16px' }}
            disabled={!pagination.previous}
            onClick={onPrevPagination}
          >
            <Icon type="double-left" />
          </Button>
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
                  <Button
                    title="Next Task"
                    size="large"
                    type="default"
                    style={{ margin: '0 16px' }}
                    disabled={current === total}
                    onClick={onNextPage}
                  >
                    <Icon type="right" />
                  </Button>
                );
              }
              if (type === 'prev') {
                return (
                  <Button
                    title="Previous Task"
                    size="large"
                    type="default"
                    style={{ margin: '0 16px' }}
                    disabled={current === 1}
                    onClick={onPrevPage}
                  >
                    <Icon type="left" />
                  </Button>
                );
              }
              return originalElement;
            }}
          />
        </Col>
        <Col>
          <Button
            title="Next Page"
            size="large"
            type="default"
            style={{ margin: '0 16px' }}
            disabled={!pagination.next}
            onClick={onNextPagination}
          >
            <Icon type="double-right" />
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
export default TaskPagination;
