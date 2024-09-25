"use client";

import React from 'react';
import { Card, Button, Row, Col, Typography, Divider } from 'antd';
import { CalendarOutlined, SolutionOutlined, ScheduleOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import schedule from '../../assets/img/citas/cat-leaping.jpg';
import appointments from '../../assets/img/citas/cat-leaping.jpg';
import calendar from '../../assets/img/citas/cat-leaping.jpg';
import glasses from '../../assets/img/citas/cat-leaping.jpg';

const { Title, Text } = Typography;

function ReservaCita() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '40px' }}>
      <Title level={1} style={{ color: '#1890ff', textAlign: 'center', marginBottom: '40px', fontSize: '36px' }}>
        Bienvenido a la Clínica Oftalmológica
      </Title>
      
      <Text style={{ textAlign: 'center', display: 'block', marginBottom: '40px', fontSize: '18px' }}>
        Selecciona una opción para gestionar tus citas y obtener recomendaciones personalizadas. Navega cómodamente por las opciones a continuación.
      </Text>
      
      <Row gutter={[24, 24]} justify="center">
        {/* Tarjeta Agendar Cita */}
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
            <CalendarOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
            <Title level={3} style={{ marginTop: '15px' }}>Agendar Cita</Title>
            <Text style={{ fontSize: '16px' }}>
              Programa una nueva cita seleccionando el horario y fecha más adecuados para ti.
            </Text>
            <Divider />
            <Link href="/agendar-cita">
              <Button type="primary" size="large" block icon={<ScheduleOutlined />}>Ir a Agendar</Button>
            </Link>
          </Card>
        </Col>

        {/* Tarjeta Citas Agendadas */}
        <Col span={24} md={12} lg={8}>
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
            <SolutionOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
            <Title level={3} style={{ marginTop: '15px' }}>Citas Agendadas</Title>
            <Text style={{ fontSize: '16px' }}>
              Revisa y gestiona las citas que has agendado previamente.
            </Text>
            <Divider />
            <Link href="/citas-agendadas">
              <Button type="primary" size="large" block icon={<CalendarOutlined />}>Ver Citas</Button>
            </Link>
          </Card>
        </Col>

        {/* Tarjeta Calendario de Citas */}
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
            <EyeOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
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

        {/* Tarjeta Recomendaciones de Marcos */}
        <Col span={24} md={12} lg={8}>
          <Card
            hoverable
            style={{ textAlign: 'center', borderRadius: '12px', padding: '20px' }}
            cover={
              <Image
                alt="Recomendaciones de Marcos"
                src={glasses}
                width={400}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            }
          >
            <EyeOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
            <Title level={3} style={{ marginTop: '15px' }}>Recomendaciones de Marcos</Title>
            <Text style={{ fontSize: '16px' }}>
              Obtén recomendaciones personalizadas para elegir el marco perfecto según tu rostro.
            </Text>
            <Divider />
            <Link href="/recomendacion-marcos">
              <Button type="primary" size="large" block icon={<EyeOutlined />}>Ver Recomendaciones</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReservaCita;
