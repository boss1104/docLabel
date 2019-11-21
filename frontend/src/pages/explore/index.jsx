import { Card, Col, Form, List, Row, Select, Typography, Avatar, Tooltip } from 'antd';

import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { router, Link } from 'umi';

import { PROJECT_TYPE } from '@/pages/constants';

import AvatarList from './components/AvatarList';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const { Paragraph } = Typography;

// TODO: Search by project name
const Projects = ({
  projects: { list = [], count, status, errors },
  dispatch,
  loading,
  form,
  location: { query, path },
}) => {
  React.useEffect(() => {
    dispatch({
      type: 'projects/fetch',
      payload: query,
    });
  }, [query]);

  const { getFieldDecorator } = form;

  const paginationProps = {
    current: Number(query.page),
    pageSize: 4,
    total: count,
    showQuickJumper: true,
    showTotal: total => `Total ${total} projects`,
    onChange: newPage =>
      router.push({
        pathname: path,
        query: {
          ...query,
          page: newPage,
        },
      }),
  };

  const cardList = list ? (
    <List
      rowKey="id"
      loading={loading}
      pagination={paginationProps}
      grid={{
        gutter: 24,
        xl: 4,
        lg: 3,
        md: 3,
        sm: 2,
        xs: 1,
      }}
      dataSource={list}
      renderItem={item => (
        <List.Item>
          <Card className={styles.card} hoverable cover={<img alt={item.name} src={item.image} />}>
            <Card.Meta
              // avatar={
              //   <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              // }
              title={
                <Tooltip placement="topLeft" title={PROJECT_TYPE[item.project_type].label}>
                  <Link to={`/projects/${item.id}/`}>
                    {PROJECT_TYPE[item.project_type].icon}
                    {` ${item.name}`}
                  </Link>
                </Tooltip>
              }
              description={
                <Paragraph
                  className={styles.item}
                  ellipsis={{
                    rows: 2,
                  }}
                >
                  {item.description}
                </Paragraph>
              }
            />
            <div className={styles.cardItemContent}>
              <span>{moment(item.updated_at).fromNow()}</span>
              <div className={styles.avatarList}>
                <AvatarList size="small">
                  {item.users.map(user => (
                    <AvatarList.Item key={`${item.id}-index`} src="user.avatar" tips="user.name" />
                  ))}
                </AvatarList>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  ) : null;
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

  return (
    <div className={styles.coverCardList}>
      <Card bordered={false}>
        <Form layout="inline">
          <StandardFormRow
            title="Category"
            block
            style={{
              paddingBottom: 11,
            }}
          >
            <FormItem>
              {getFieldDecorator('category', {
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
            </FormItem>
          </StandardFormRow>
          <StandardFormRow
            title="Other options"
            grid
            last
            style={{
              paddingBottom: 11,
            }}
          >
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout} label="Author">
                  {getFieldDecorator(
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
                      <Option value="lisa">Wang Zhaojun</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem {...formItemLayout} label="Popularity">
                  {getFieldDecorator(
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
                      <Option value="good">Excellent</Option>
                      <Option value="normal">Ordinary</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <div className={styles.cardList}>{cardList}</div>
    </div>
  );
};

const WrapForm = Form.create({
  onValuesChange({ location }, changedValues, allValue) {
    router.push({
      pathname: location.path,
      query: {
        // FIXME: maybe bug
        type: changedValues.category,
        page: 1,
      },
    });
  },
})(Projects);
export default connect(({ projects, loading }) => ({
  projects,
  loading: loading.models.projects,
}))(WrapForm);
