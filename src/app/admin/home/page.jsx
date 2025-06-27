'use client';

import { Button, Card, Col, Layout, Row, Statistic, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import { Pie } from '@ant-design/charts';
import SiderMenuSeller from '../components/SiderMenuSeller';
import Title from 'antd/es/typography/Title';

function HomeSeller() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const data = [
    {
      type: 'Pendiente',
      value: 1,
    },
    {
      type: 'En proceso',
      value: 3,
    },
    {
      type: 'Listo para recojo',
      value: 1,
    },
    {
      type: 'Entregado',
      value: 2,
    },
    {
      type: 'Cancelado',
      value: 1,
    },
  ];

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      position: 'outside',
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='1' />
        <Content style={{ margin: '8px 16px', width: '100vh' }}>
          <div
            style={{
              padding: 24,
              maxHeight: '100%',
              width: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: 'auto',
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Card bordered={false}>
                  <Statistic
                    title='Productos Totales'
                    value={67}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  <Statistic
                    title='Productos Vendidos'
                    value={5}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  <Statistic
                    title='Pedidos Completados'
                    value={2}
                  />
                </Card>
              </Col>
            </Row>
            <br />
            <br />
            <Title level={3}>Pedidos por estado</Title>
            <Pie {...config} />;
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default HomeSeller;
