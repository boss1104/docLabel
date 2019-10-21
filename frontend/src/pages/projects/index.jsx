import { Card, Col, Form, List, Row, Select, Typography } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import AvatarList from './components/AvatarList';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;
const { Paragraph } = Typography;

class Projects extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projects/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const {
      projects: { list = [] },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const cardList = list ? (
      <List
        rowKey="id"
        loading={loading}
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
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.title} src={item.cover} />}
            >
              <Card.Meta
                title={<a>{item.title}</a>}
                description={
                  <Paragraph
                    className={styles.item}
                    ellipsis={{
                      rows: 2,
                    }}
                  >
                    {item.subDescription}
                  </Paragraph>
                }
              />
              <div className={styles.cardItemContent}>
                <span>{moment(item.updatedAt).fromNow()}</span>
                <div className={styles.avatarList}>
                  <AvatarList size="small">
                    {item.members.map(member => (
                      <AvatarList.Item
                        key={`${item.id}-index`}
                        src={member.avatar}
                        tips={member.name}
                      />
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
                {getFieldDecorator('category')(
                  <TagSelect expandable>
                    <TagSelect.Option value="cat1">Category 1</TagSelect.Option>
                    <TagSelect.Option value="cat2">Category 2</TagSelect.Option>
                    <TagSelect.Option value="cat3">Category 3</TagSelect.Option>
                  </TagSelect>,
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="Other options" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="Author">
                    {getFieldDecorator('author', {})(
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
                    {getFieldDecorator('rate', {})(
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
  }
}

const WarpForm = Form.create({
  onValuesChange({ dispatch }) {
    dispatch({
      type: 'projects/fetch',
      payload: {
        count: 8,
      },
    });
  },
})(Projects);
export default connect(({ projects, loading }) => ({
  projects,
  loading: loading.models.projects,
}))(WarpForm);
