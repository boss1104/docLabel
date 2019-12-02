import { Card, Col, Divider, Icon, Row, Button } from 'antd';
import React from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { router } from 'umi';
import Contributions from './components/Contributions';
import Approvals from './components/Approvals';
import Projects from './components/Projects';
import styles from './Center.less';
import { PAGE_SIZE } from '@/pages/constants';

const Center = connect(({ loading, user, accountCenter }) => ({
  currentUser: user.currentUser,
  myProjects: accountCenter.myProjects,
  myContributions: accountCenter.myContributions,
  myApprovals: accountCenter.myApprovals,
  currentUserLoading: loading.effects['user/fetchCurrent'],
}))(props => {
  const {
    dispatch,
    currentUser,
    currentUserLoading,
    location,
    myProjects,
    myContributions,
    myApprovals,
  } = props;

  const { pagination } = myProjects;
  const { pagination: cPagination } = myContributions;
  const { pagination: aPagination } = myApprovals;

  const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);

  const isSuperUser = currentUser && Object.keys(currentUser).length && currentUser.is_superuser;
  const dataReady = currentUser
    ? !!Object.keys(pagination).length
    : !!(Object.keys(cPagination).length && Object.keys(aPagination).length);
  const [tabKey, setTabKey] = React.useState(isSuperUser ? 'projects' : 'contributions');

  const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

  const fetchMyProject = async page => {
    const offset = page ? (page - 1) * PAGE_SIZE : 0;
    if (dispatch) {
      await dispatch({
        type: 'accountCenter/fetchMyProject',
        payload: {
          offset,
        },
      });
    }
  };

  const fetchMyContribution = async page => {
    const offset = page ? (page - 1) * PAGE_SIZE : 0;
    if (dispatch) {
      await dispatch({
        type: 'accountCenter/fetchMyContribution',
        payload: {
          offset,
        },
      });
    }
  };

  const fetchMyApproval = async page => {
    const offset = page ? (page - 1) * PAGE_SIZE : 0;
    if (dispatch) {
      await dispatch({
        type: 'accountCenter/fetchMyApproval',
        payload: {
          offset,
        },
      });
    }
  };

  const fetchData = async tab => {
    const arr = [
      ...(isSuperUser
        ? [
            {
              key: 'projects',
              func: fetchMyProject,
              page: location.query.pp,
            },
          ]
        : [
            {
              key: 'contributions',
              func: fetchMyContribution,
              page: location.query.pc,
            },
            {
              key: 'approvals',
              func: fetchMyApproval,
              page: location.query.pa,
            },
          ]),
    ].sort((a, b) => {
      if (a.key === tab) return -1;
      if (b.key === tab) return 1;
      return 0;
    });

    if (isSuperUser) {
      await arr[0].func(arr[0].page);
    } else {
      await arr[0].func(arr[0].page);
      await arr[1].func(arr[1].page);
    }
  };

  React.useEffect(() => {
    if (location.query.tab) {
      setTabKey(location.query.tab);
      fetchData(location.query.tab);
    } else fetchData();
  }, []);

  const onTabChange = key => {
    // If you need to sync state to url
    const { match } = props;
    router.push({
      query: { ...location.query, tab: key },
    });
    setTabKey(key);
  };

  const renderChildrenByTabKey = () => {
    if (tabKey === 'projects') {
      return <Projects location={location} fetchMyProject={fetchMyProject} />;
    }

    if (tabKey === 'contributions') {
      return <Contributions location={location} fetchMyContribution={fetchMyContribution} />;
    }

    if (tabKey === 'approvals') {
      return <Approvals location={location} fetchMyApproval={fetchMyApproval} />;
    }

    return null;
  };

  const operationTabList = [
    ...(isSuperUser
      ? [
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
                  {dataReady && `(${pagination.count})`}
                </span>
              </span>
            ),
          },
        ]
      : [
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
                  {dataReady && `(${cPagination.count})`}
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
                  {dataReady && `(${aPagination.count})`}
                </span>
              </span>
            ),
          },
        ]),
  ];

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
            onTabChange={onTabChange}
          >
            {renderChildrenByTabKey()}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
});

export default React.memo(Center);
