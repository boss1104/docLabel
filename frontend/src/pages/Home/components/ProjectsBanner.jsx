import React from 'react';
import { Button, Carousel, Card, Icon } from 'antd';
import styles from './index.less';

const { Meta } = Card;

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', zIndex: 1, left: 15, top: '80%' }}
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
      style={{ ...style, display: 'block', zIndex: 1, right: 15, top: '80%' }}
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
      image: 'https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg',
      title: 'Team Collaboration',
      description: 'Annotation with your teammates',
    },
    {
      key: '#2',
      image: 'https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg',
      title: 'Team Collaboration 2',
      description: 'Annotation with your teammates 2',
    },
    {
      key: '#3',
      image: 'https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg',
      title: 'Team Collaboration 3',
      description: 'Annotation with your teammates 3',
    },
    {
      key: '#4',
      image: 'https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg',
      title: 'Team Collaboration 4',
      description: 'Annotation with your teammates 4',
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
          <React.Fragment key={item.key}>
            <Card
              className={styles.card}
              hoverable
              cover={
                <img
                  className={styles.cardCover}
                  alt="example"
                  src="https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg"
                />
              }
            >
              <Meta title={item.title} description={item.description} />
            </Card>
          </React.Fragment>
        ))}
      </Carousel>
    </div>
  );
}
export default React.memo(ProjectsBanner);
