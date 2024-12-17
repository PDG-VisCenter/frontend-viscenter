'use client';

import { Layout, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import { Line } from '@ant-design/plots';
import SiderMenuSeller from '../components/SiderMenuSeller';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

function HomeSeller() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'authenticated') {
      if (!session.roles.includes('seller_role')) {
        router.push('/');
      }
    }
  }, [status, session, router]);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];

  const config = {
    data,
    xField: 'year',
    yField: 'value',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
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
            <Line {...config} />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default HomeSeller;
