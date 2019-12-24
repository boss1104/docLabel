import NamedEntityRecognition from '@/assets/types/Named_Entity_Recognition.png';
import PDFLabeling from '@/assets/types/PDF_Labeling.png';
import SentimentAnalysis from '@/assets/types/Sentiment_Analysis.png';
import Translation from '@/assets/types/Translation.png';
import { Card, Carousel, Icon, Typography, Row, Col } from 'antd';
import React from 'react';
import styles from './index.less';

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', zIndex: 1, left: 15 }}
      onClick={onClick}
    >
      <Icon
        type="left-circle"
        style={{
          fontSize: 32,
          color: '#434343',
          opacity: 0.3,
        }}
      />
    </div>
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', zIndex: 1, right: 15 }}
      onClick={onClick}
    >
      <Icon
        type="right-circle"
        style={{
          fontSize: 32,
          color: '#434343',
          opacity: 0.3,
        }}
      />
    </div>
  );
}

function ProjectsBanner(props) {
  const data = [
    {
      key: '#1',
      image: SentimentAnalysis,
      title: 'Sentiment Analysis',
      description: 'Sentiment Analysis',
    },
    {
      key: '#2',
      image: NamedEntityRecognition,
      title: 'Named Entity Recognition',
      description: 'Named Entity Recognition',
    },
    {
      key: '#3',
      image: Translation,
      title: 'Translation',
      description: 'Translation',
    },
    {
      key: '#4',
      image: PDFLabeling,
      title: 'PDF Labeling',
      description: 'PDF Labeling',
    },
  ];

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className={styles.projectsBanner}>
      <Carousel {...settings}>
        {data.map(item => (
          <div key={item.key}>
            <Row type="flex" justify="space-around" align="middle" gutter={48}>
              <Col xs={24} md={12}>
                <img alt="example" src={item.image} style={{ height: 400, float: 'right' }} />
              </Col>
              <Col xs={24} md={12}>
                <div style={{ textAlign: 'left' }}>
                  <Typography.Title level={2} strong>
                    {item.title}
                  </Typography.Title>
                  <Typography.Paragraph ellipsis={{ rows: 2 }}>
                    {item.description}
                  </Typography.Paragraph>
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
export default React.memo(ProjectsBanner);
