import React from 'react';
import { Button, Pagination, Icon } from 'antd';

function TaskPagination({ onNextPage, onPrevPage, total, current }) {
  return (
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
    ></Pagination>
  );
}
export default TaskPagination;
