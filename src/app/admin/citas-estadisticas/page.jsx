'use client';

import { useEffect, useState } from 'react';
import { Layout, theme, DatePicker, Button, Row, Col, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import axios from 'axios';
import { Bar, Histogram, Pie, Column } from '@ant-design/charts';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import { saveAs } from 'file-saver';

const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

function Appointments() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5281/api/History')
      .then((response) => {
        setHistoryData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => console.error('Error fetching history data:', error));
  }, []);

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

  const ageDistribution = filteredData.map((item) => {
    const birthYear = new Date(item.patientBirthday).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return { age, birthYear };
  });

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
                <Histogram
                  data={ageDistribution}
                  binField='age'
                  binWidth={1}
                  color='#f759ab'
                  xAxis={{
                    title: { text: 'Edad' },
                  }}
                  yAxis={{
                    title: { text: 'Frecuencia' },
                  }}
                  legend={{ position: 'top-left' }}
                  interactions={[{ type: 'element-highlight' }, { type: 'element-active' }]}
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
