import React from 'react';
import { Card, Form, Row, Col, Select, Input } from 'antd';
import { router } from 'umi';
import { connect } from 'dva';
import { PROJECT_TYPE } from '@/pages/constants';

import StandardFormRow from '../StandardFormRow';
import TagSelect from '../TagSelect';
import styles from './index.less';

// TODO: Search by project name
const FilterForm = connect(({ projects, loading }) => ({
  projects,
  loadingProject: loading.models.projects,
}))(props => {
  const {
    dispatch,
    form,
    location: { query },
  } = props;

  const formItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };

  const fetchProjects = async () => {
    await dispatch({
      type: 'projects/fetch',
      payload: query,
    });
  };

  React.useEffect(() => {
    fetchProjects();
  }, [query]);

  const handleSearch = q => {
    router.push({
      query: { ...query, q },
    });
  };

  return (
    <Card bordered={false}>
      <div
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          paddingBottom: '24px',
          borderBottom: '1px dashed #17171f',
        }}
      >
        <Input.Search
          placeholder="Input project name or description"
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          style={{
            maxWidth: 522,
            width: '100%',
          }}
        />
      </div>
      <Form layout="inline">
        <StandardFormRow
          title="Category"
          block
          style={{
            paddingBottom: 11,
          }}
        >
          <Form.Item>
            {form.getFieldDecorator('type', {
              initialValue: Object.keys(PROJECT_TYPE),
            })(
              <TagSelect>
                {Object.keys(PROJECT_TYPE).map(key => (
                  <TagSelect.Option value={key} key={key}>
                    {PROJECT_TYPE[key].label}
                  </TagSelect.Option>
                ))}
              </TagSelect>,
            )}
          </Form.Item>
        </StandardFormRow>
        {/* <StandardFormRow
          title="Other options"
          grid
          last
          style={{
            paddingBottom: 11,
          }}
        >
          <Row gutter={16}>
            <Col lg={8} md={10} sm={10} xs={24}>
              <Form.Item {...formItemLayout} label="Author">
                {form.getFieldDecorator(
                  'author',
                  {},
                )(
                  <Select
                    placeholder="Unlimited"
                    style={{
                      maxWidth: 200,
                      width: '100%',
                    }}
                  >
                    <Select.Option value="lisa">Wang Zhaojun</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={10} sm={10} xs={24}>
              <Form.Item {...formItemLayout} label="Popularity">
                {form.getFieldDecorator(
                  'rate',
                  {},
                )(
                  <Select
                    placeholder="Unlimited"
                    style={{
                      maxWidth: 200,
                      width: '100%',
                    }}
                  >
                    <Select.Option value="good">Excellent</Select.Option>
                    <Select.Option value="normal">Ordinary</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </StandardFormRow> */}
      </Form>
    </Card>
  );
});

export default Form.create({
  onValuesChange(props, changedValues, allValue) {
    router.push({
      query: { project_type: changedValues.type },
    });
  },
})(React.memo(FilterForm));
