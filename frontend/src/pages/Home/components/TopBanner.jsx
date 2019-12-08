import React from 'react';
import { Button, Row, Col, Typography } from 'antd';
import { Parallax } from 'react-parallax';

import styles from './index.less';
import logo from '@/assets/logo.svg';

function TopBanner(props) {
  const image = 'https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg';
  return (
    <div className={styles.topBanner}>
      <Parallax bgImage={image} strength={500}>
        <div className={styles.wrapper}>
          <Row
            type="flex"
            gutter={[0, 24]}
            align="middle"
            justify="center"
            className={styles.content}
          >
            <Col xs={24} md={10} className={styles.logo}>
              <img src={logo} alt="logo" />
            </Col>
            <Col xs={24} md={14}>
              <Row type="flex" gutter={16} className={styles.text} justify="center">
                <Col xs={24}>
                  <Typography.Title className={styles.title}>
                    The Text Annotation <br />
                    For Your Teams
                  </Typography.Title>
                </Col>
                <Col className={styles.btnExplore}>
                  <Button size="large" type="primary">
                    Explore
                  </Button>
                </Col>
                <Col className={styles.btnGithub}>
                  <Button size="large" type="default" icon="github">
                    Github
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Parallax>
    </div>
  );
}
export default React.memo(TopBanner);
