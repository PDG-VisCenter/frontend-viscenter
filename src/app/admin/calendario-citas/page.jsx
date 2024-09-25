'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, theme, Table, Button, Modal, Input, DatePicker, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import dayjs from 'dayjs';

const { Title } = Typography;

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [error, setError] = useState('');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const schedules = [
    { id: 11, time: '20:00:00 - 21:00:00' },
    { id: 10, time: '16:00:00 - 17:00:00' },
    { id: 9, time: '15:00:00 - 16:00:00' },
    { id: 8, time: '14:00:00 - 15:00:00' },
    { id: 7, time: '13:00:00 - 14:00:00' },
    { id: 6, time: '12:00:00 - 13:00:00' },
    { id: 5, time: '11:00:00 - 12:00:00' },
    { id: 4, time: '10:00:00 - 11:00:00' },
    { id: 3, time: '09:00:00 - 10:00:00' },
    { id: 2, time: '08:00:00 - 09:00:00' },
    { id: 1, time: '07:00:00 - 08:00:00' },
  ];

  useEffect(() => {
    axios.get('http://localhost:5281/api/ExtendedAppointment')
      .then(response => {
        const appointmentsData = response.data;
        setAppointments(appointmentsData);
      })
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowModal(true);
  };

  const confirmCancel = () => {
    if (!cancelReason) {
      setError('Debe ingresar una razón para cancelar la cita.');
      return;
    }

    const today = dayjs().format('YYYY-MM-DD');
    
    axios
      .delete(`http://localhost:5281/api/ExtendedAppointment/${appointmentToCancel.appointmentID}`)
      .then(() => {
        if (dayjs(appointmentToCancel.appointmentDate).format('YYYY-MM-DD') === today) {
          return axios.patch(`http://localhost:5281/api/Availability/${appointmentToCancel.scheduleID}`, {
            isAvailable: true,
          });
        }
      })
      .then(() => {
        setAppointments(appointments.filter(app => app.appointmentID !== appointmentToCancel.appointmentID));
        setShowModal(false);
        setCancelReason('');
      })
      .catch(error => {
        console.error('Error cancelling appointment:', error);
        setError('Error al cancelar la cita.');
      });
  };

  const filteredAppointments = selectedDate
    ? appointments.filter(appointment => dayjs(appointment.appointmentDate).format('YYYY-MM-DD') === selectedDate)
    : appointments;

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'appointmentDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Horario',
      dataIndex: 'scheduleID',
      render: (scheduleID) => {
        const schedule = schedules.find(s => s.id === scheduleID);
        return schedule ? schedule.time : 'N/A';
      },
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
    },
    {
      title: 'Acciones',
      render: (appointment) => (
        <Button danger onClick={() => handleCancelClick(appointment)}>
          Cancelar
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='7' />
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
              }}
            >
              Citas Agendadas
            </Title>

            <DatePicker onChange={handleDateChange} style={{ marginBottom: 20 }} />

            <Table
              columns={columns}
              dataSource={filteredAppointments}
              rowKey='appointmentID'
              pagination={false}
            />
          </div>
        </Content>
      </Layout>

      <Modal
        title='Confirmar Cancelación'
        open={showModal}
        onOk={confirmCancel}
        onCancel={() => setShowModal(false)}
      >
        <Input.TextArea
          placeholder='Razón para cancelar la cita'
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={3}
        />
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Modal>
    </Layout>
  );
}

export default Appointments;
