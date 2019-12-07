import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Row, Col } from 'antd';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { getChildrenToRender } from './utils';
import { HomeContext } from './HomeContext';

function Content(props) {
  const { isDark } = React.useContext(HomeContext);

  const { dataSource, ...rest } = props;
  const { wrapper, titleWrapper, page, OverPack: overPackData, childWrapper } = dataSource;
  return (
    <div {...rest} {...wrapper}>
      <div {...page}>
        <div {...titleWrapper}>{titleWrapper.children.map(getChildrenToRender)}</div>
        <OverPack {...overPackData}>
          <QueueAnim
            type="bottom"
            key="block"
            leaveReverse
            component={Row}
            componentProps={childWrapper}
          >
            {childWrapper.children.map((block, i) => {
              const { children: item, ...blockProps } = block;
              return (
                <Col key={i.toString()} {...blockProps}>
                  <div {...item}>{item.children.map(getChildrenToRender)}</div>
                </Col>
              );
            })}
          </QueueAnim>
        </OverPack>
      </div>
    </div>
  );
}

export default React.memo(Content);
