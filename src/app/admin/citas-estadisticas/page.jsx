'use client';

import { useEffect, useState } from 'react';
import { Layout, theme, DatePicker, Button, Row, Col, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import axios from 'axios';
import { Bar, Line, Pie, Column } from '@ant-design/charts';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import { saveAs } from 'file-saver';
import { fetchUserAccessToken } from '@/app/services/keycloakServices';
import { signIn, useSession } from 'next-auth/react';

const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

function Appointments() {
  const { data: session, status } = useSession();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session || !session.userId) {
      signIn('keycloak');
      return;
    }

    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    const token = await fetchUserAccessToken();
    console.log(token);

    try {
      axios
        .get('http://localhost:5270/viscenter/api/v1/History', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setHistoryData(response.data);
          setFilteredData(response.data);
        })
        .catch((error) => console.error('Error fetching history data:', error));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateFilterChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      const filtered = historyData.filter((item) => {
        const appointmentDate = new Date(item.appointmentDate);
        return appointmentDate >= start && appointmentDate <= end;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(historyData);
    }
  };

  const handleExport = () => {
    const csvData = filteredData
      .map(
        (item) =>
          `${item.historyID},${item.userID},${item.patientName},${item.serviceType},${item.appointmentDate},${item.status},${item.patientBirthday}`
      )
      .join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'appointments_statistics.csv');
  };

  const appointmentsPerMonth = filteredData.reduce((acc, curr) => {
    const month = new Date(curr.appointmentDate).toLocaleString('default', {
      month: 'long',
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const serviceTypeStats = filteredData.reduce((acc, curr) => {
    acc[curr.serviceType] = (acc[curr.serviceType] || 0) + 1;
    return acc;
  }, {});

  const cancelledAppointments = filteredData.filter((item) => item.status === 'Canceled').length;
  const scheduledAppointments = filteredData.filter((item) => item.status === 'Scheduled').length;

  const ageDistribution = filteredData
    .map((item) => {
      const birthYear = item.patientBirthday ? new Date(item.patientBirthday).getFullYear() : null;
      const currentYear = new Date().getFullYear();
      const age = birthYear ? currentYear - birthYear : null;
      return age;
    })
    .filter((age) => age !== null);

  const ageCount = ageDistribution.reduce((acc, age) => {
    acc[age] = (acc[age] || 0) + 1;
    return acc;
  }, {});

  const lineData = Object.entries(ageCount).map(([age, count]) => ({
    age: parseInt(age, 10),
    count,
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='8' />
        <Content style={{ margin: '8px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Title level={2}>Estadísticas de Citas</Title>

            <Row style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <RangePicker onChange={handleDateFilterChange} />
              </Col>
              <Col
                span={12}
                style={{ textAlign: 'right' }}
              >
                <Button onClick={handleExport}>Exportar Datos</Button>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Paragraph style={{ fontSize: '18px', fontWeight: 'bold' }}>Cantidad de citas en cada mes.</Paragraph>
                <Column
                  data={Object.entries(appointmentsPerMonth).map(([month, count]) => ({ month, count }))}
                  xField='month'
                  yField='count'
                  label={{
                    position: 'top',
                    style: { fill: '#000' },
                  }}
                  columnStyle={{ radius: [20, 20, 0, 0] }}
                />
              </Col>

              <Col span={12}>
                <Paragraph style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Servicios más solicitados y veces solicitadas.
                </Paragraph>
                <Pie
                  data={Object.entries(serviceTypeStats).map(([type, count]) => ({ type, count }))}
                  angleField='count'
                  colorField='type'
                  radius={0.8}
                />
              </Col>

              <Col span={12}>
                <Paragraph style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Comparación citas agendadas y canceladas.
                </Paragraph>
                <Bar
                  data={[
                    { status: 'Agendadas', count: scheduledAppointments },
                    { status: 'Canceladas', count: cancelledAppointments },
                  ]}
                  xField='status'
                  yField='count'
                  seriesField='status'
                  legend={{ position: 'top-left' }}
                />
              </Col>

              <Col span={12}>
                <Paragraph style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Distribución de edades de pacientes.
                </Paragraph>
                <Line
                  data={lineData}
                  xField='age'
                  yField='count'
                  point={{
                    size: 10,
                    shape: 'circle',
                  }}
                  label={{
                    style: { fill: '#000' },
                  }}
                  xAxis={{
                    title: { text: 'Edad' },
                  }}
                  yAxis={{
                    title: { text: 'Número de Pacientes' },
                  }}
                  tooltip={{
                    shared: true,
                    showMarkers: false,
                  }}
                />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Appointments;
