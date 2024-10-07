"use client";

import React from 'react';
import { Card, Button, Row, Col, Typography, Divider, ConfigProvider } from 'antd';
import { CalendarOutlined, SolutionOutlined, ScheduleOutlined, EyeOutlined, BookOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import schedule from '../../assets/img/citas/agendarCita.jpg';
import appointments from '../../assets/img/citas/citasAgendadas.jpg';
import calendar from '../../assets/img/citas/calendarioCitas.jpg';

const { Title, Text } = Typography;

function ReservaCita() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#fe0034',
          colorBgSolidHover: '#c8306c',
          colorText: '#000',
          colorTextSecondary: '#555',
          borderRadius: 4,
        },
      }}
    >
    <div style={{backgroundColor: '#f0f2f5'}}>
      <Header />
      <Title level={1} style={{ color: '#fe0034', textAlign: 'center', marginBottom: '12px', marginTop: '8px', fontSize: '36px' }}>
        Citas Oftalmológicas
      </Title>
      
      <Text style={{ textAlign: 'center', display: 'block', marginBottom: '40px', fontSize: '18px' }}>
        Selecciona una opción para gestionar tus citas y obtener recomendaciones personalizadas. Navega cómodamente por las opciones a continuación.
      </Text>
      
      <Row gutter={[0, 0]} justify="center">
        <Col span={24} md={12} lg={8}>
          <Card
            hoverable
            style={{ textAlign: 'center', borderRadius: '12px', padding: '20px' }}
            cover={
              <Image
                alt="Agendar Cita"
                src={schedule}
                width={400}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            }
          >
            <CalendarOutlined style={{ fontSize: '36px', color: '#fe0034' }} />
            <Title level={3} style={{ marginTop: '15px' }}>Agendar Cita</Title>
            <Text style={{ fontSize: '16px' }}>
              Programa una nueva cita seleccionando el horario y fecha más adecuados para ti.
            </Text>
            <Divider />
            <Link href="/agendar-cita">
              <Button type="primary" size="large" block icon={<BookOutlined />}>Ir a Agendar</Button>
            </Link>
          </Card>
        </Col>

        <Col span={24} md={12} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            hoverable
            style={{ textAlign: 'center', borderRadius: '12px', padding: '20px' }}
            cover={
              <Image
                alt="Citas Agendadas"
                src={appointments}
                width={400}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            }
          >
            <SolutionOutlined style={{ fontSize: '36px', color: '#fe0034' }} />
            <Title level={3} style={{ marginTop: '15px' }}>Citas Agendadas</Title>
            <Text style={{ fontSize: '16px' }}>
              Revisa y gestiona las citas que has agendado previamente.
            </Text>
            <Divider />
            <Link href="/citas-agendadas">
              <Button type="primary" size="large" block icon={<ScheduleOutlined />}>Ver Citas</Button>
            </Link>
          </Card>
        </Col>

        <Col span={24} md={12} lg={8}>
          <Card
            hoverable
            style={{ textAlign: 'center', borderRadius: '12px', padding: '20px' }}
            cover={
              <Image
                alt="Calendario de Citas"
                src={calendar}
                width={400}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            }
          >
            <EyeOutlined style={{ fontSize: '36px', color: '#fe0034' }} />
            <Title level={3} style={{ marginTop: '15px' }}>Calendario de Citas</Title>
            <Text style={{ fontSize: '16px' }}>
              Consulta el calendario disponible para reservar citas en fechas futuras.
            </Text>
            <Divider />
            <Link href="/calendario-citas">
              <Button type="primary" size="large" block icon={<CalendarOutlined />}>Ver Calendario</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
    </ConfigProvider>
  );
}

export default ReservaCita;
