'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Table, Input, DatePicker, Typography, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import dayjs from 'dayjs';

const { Title } = Typography;

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    axios.get('http://localhost:5281/api/History')
      .then(response => {
        setAppointments(response.data);
        setFilteredAppointments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (value) => {
    const filtered = appointments.filter(appointment =>
      appointment.patientName.toLowerCase().includes(value.toLowerCase()) ||
      appointment.serviceType.toLowerCase().includes(value.toLowerCase()) ||
      appointment.status.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAppointments(filtered);
    setSearchText(value);
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setSelectedDate(formattedDate);

    if (formattedDate) {
      const filtered = appointments.filter(appointment =>
        dayjs(appointment.appointmentDate).format('YYYY-MM-DD') === formattedDate
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  };

  const columns = [
    {
      title: 'Nombre del Paciente',
      dataIndex: 'patientName',
      key: 'patientName',
      width: 200,
    },
    {
      title: 'Tipo de Servicio',
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: 250,
    },
    {
      title: 'Fecha de la Cita',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
      width: 150,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 150,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='10' />
        <Content style={{ margin: '8px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: '88vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Title
              level={2}
              style={{
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Historial de Citas Oftalmológicas
            </Title>

            <Input.Search
              placeholder='Buscar por nombre, tipo de servicio o estado...'
              allowClear
              enterButton='Buscar'
              size='large'
              onSearch={handleSearch}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ marginBottom: 20 }}
            />

            <DatePicker
              onChange={handleDateChange}
              style={{ marginBottom: 20 }}
              placeholder='Filtrar por fecha de cita'
            />

            <Table
              columns={columns}
              dataSource={filteredAppointments}
              rowKey='historyID'
              pagination={{ pageSize: 10 }}
              loading={loading}
              scroll={{ y: 400 }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Appointments;
