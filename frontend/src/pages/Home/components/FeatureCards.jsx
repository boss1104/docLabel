import React from 'react';
import { Carousel, Card, Row, Col, Typography, Icon } from 'antd';
import Meta from 'antd/lib/card/Meta';
import styles from './index.less';

function FeatureCards(props) {
  const [state, setState] = React.useState();

  const data = [
    {
      key: '#1',
      icon: 'team',
      title: 'Team Collaboration',
      description: 'Annotation with team collaboration',
    },
    {
      key: '#2',
      icon: 'team',
      title: 'Team Collaboration',
      description: 'Annotation with team collaboration',
    },
    {
      key: '#3',
      icon: 'team',
      title: 'Team Collaboration',
      description: 'Annotation with team collaboration',
    },
  ];

  return (
    <div className={styles.featureCards}>
      <Typography.Title className={styles.featureTitle} level={2}>
        The Features
      </Typography.Title>
      <Row type="flex" align="middle" justify="center" gutter={[24, 24]}>
        {data.map(item => (
          <Col xs={24} md={8} key={item.key}>
            <Card
              hoverable
              cover={<Icon type="smile" theme="twoTone" className={styles.cardCover} />}
            >
              <Meta title="Europe Street beat" description="www.instagram.com" />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
export default React.memo(FeatureCards);
