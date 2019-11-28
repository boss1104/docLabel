import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Spin, message } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import Editor from './components/Editor';
import Markdown from '@/components/Markdown';

const initialSource =
  '# Please enter the annotation guideline for user <a>https://www.markdownguide.org/getting-started</a>(Markdown)';

const Guide = props => {
  const {
    dispatch,
    project: { currentProject },
    loading,
    dark,
  } = props;
  const [markdownSrc, setMarkdownSrc] = React.useState(initialSource);

  const handleMarkdownChange = value => {
    setMarkdownSrc(value);
  };

  React.useEffect(() => {
    setMarkdownSrc(currentProject.guideline);
  }, [currentProject]);

  const updateGuideLine = async () => {
    try {
      await dispatch({
        type: 'guide/updateGuideline',
        payload: { guideline: markdownSrc },
      });
      message.success('Successfully updated guide line!');
    } catch (error) {
      console.log(error.data);
      message.error('Something wrong. Try again !');
    }
  };

  return (
    <PageHeaderWrapper
      content={
        <Button icon="cloud-upload" type="primary" onClick={() => updateGuideLine()}>
          Update guideline
        </Button>
      }
    >
      <Spin spinning={!!loading}>
        <div className={styles.main}>
          <Row type="flex" gutter={24}>
            <Col span={12} className={styles.editorPane}>
              <Editor value={markdownSrc} onChange={handleMarkdownChange} dark={dark} />
            </Col>
            <Col span={12} className={styles.resultPane}>
              <Markdown markdownSrc={markdownSrc} />
            </Col>
          </Row>
        </div>
      </Spin>
    </PageHeaderWrapper>
  );
};

export default connect(({ project, loading, settings }) => ({
  project,
  loading: loading.effects['guide/updateGuideline'],
  dark: settings.navTheme === 'dark',
}))(Guide);
