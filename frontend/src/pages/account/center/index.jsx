import { Avatar, Card, Col, Divider, Icon, Input, Row, Tag, Button } from 'antd';
import React, { PureComponent } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { router } from 'umi';
import Approvals from './components/Approvals';
import Contributions from './components/Contributions';
import Projects from './components/Projects';
import styles from './Center.less';

const operationTabList = [
  {
    key: 'projects',
    tab: (
      <span>
        Projects{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          (8)
        </span>
      </span>
    ),
  },
  {
    key: 'contributions',
    tab: (
      <span>
        Contributions{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          (8)
        </span>
      </span>
    ),
  },

  {
    key: 'approvals',
    tab: (
      <span>
        Approval{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          (8)
        </span>
      </span>
    ),
  },
];

@connect(({ loading, user }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
}))
class Center extends PureComponent {
  state = {
    tabKey: 'projects',
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'accountCenter/fetchMyProject',
    });
  }

  onTabChange = key => {
    // If you need to sync state to url
    // const { match } = this.props;
    // router.push(`${match.url}/${key}`);
    this.setState({
      tabKey: key,
    });
  };

  renderChildrenByTabKey = tabKey => {
    if (tabKey === 'projects') {
      return <Projects />;
    }

    if (tabKey === 'contributions') {
      return <Contributions />;
    }

    if (tabKey === 'approvals') {
      return <Approvals />;
    }

    return null;
  };

  render() {
    const { tabKey } = this.state;
    const { currentUser, currentUserLoading } = this.props;
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card
              bordered={false}
              style={{
                marginBottom: 24,
              }}
              loading={dataLoading}
            >
              {!dataLoading ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="avatar" src={currentUser.avatar || url} />
                    <div className={styles.name}>{currentUser.full_name}</div>
                    {/* <div>signature</div> */}
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <Icon type="mail" theme="twoTone" />
                      {currentUser.email}
                    </p>
                    <p>
                      <Icon type="smile" theme="twoTone" />
                      {currentUser.username}
                    </p>
                  </div>
                  <div className={styles.buttonEdit}>
                    <Button onClick={() => router.push('/account/settings')} type="primary" block>
                      Edit profile
                    </Button>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>Other info</div>
                    {/*  */}
                  </div>
                  <Divider
                    style={{
                      marginTop: 16,
                    }}
                    dashed
                  />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>Notice</div>
                    <Row gutter={36}>{/*  */}</Row>
                  </div>
                </div>
              ) : null}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
