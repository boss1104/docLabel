import format from '@/assets/features/format.svg';
import group from '@/assets/features/group.svg';
import languages from '@/assets/features/languages.svg';
import text from '@/assets/features/text.svg';
import { Card, Col, Row, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';
import styles from './index.less';

function FeatureCards(props) {
  const data = [
    {
      key: '#1',
      image: group,
      title: 'Team Collaboration',
      description: 'Define guidelines and invite others to join your project',
    },
    {
      key: '#2',
      image: text,
      title: 'Text Annotation Tool',
      description: 'Variety in the type annotation tool',
    },
    {
      key: '#3',
      image: format,
      title: 'Multiple formats',
      description: 'Annotation with team collaboration',
    },
    {
      key: '#4',
      image: languages,
      title: 'Multilingual support',
      description: 'English, Vietnamese, etc',
    },
  ];

  return (
    <div className={styles.featureCards}>
      <Typography.Title className={styles.featureTitle} level={2}>
        Features
      </Typography.Title>
      <Row type="flex" align="stretch" justify="center" gutter={[24, 24]}>
        {data.map(item => (
          <Col xs={24} md={6} key={item.key}>
            <Card
              style={{ height: '100%' }}
              hoverable
              cover={
                <div className={styles.cardCover}>
                  <img alt={item.key} src={item.image} />
                </div>
              }
            >
              <Meta
                title={
                  <Typography.Title level={4} strong>
                    {item.title}
                  </Typography.Title>
                }
                description={
                  <Typography.Paragraph ellipsis={{ rows: 2 }}>
                    {item.description}
                  </Typography.Paragraph>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
export default React.memo(FeatureCards);
