'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, theme, Table, Button, Modal, Input, DatePicker, Typography, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import dayjs from 'dayjs';
import { fetchUserEmail } from '@/app/services/keycloakServices';

const { Title } = Typography;

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [error, setError] = useState('');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    axios
      .get('http://localhost:5281/api/ExtendedAppointment')
      .then((response) => {
        const appointmentsData = response.data;
        setAppointments(appointmentsData);
      })
      .catch((error) => console.error('Error fetching appointments:', error));

    axios
      .get('http://localhost:5281/api/ExtendedAppointment/schedules')
      .then((response) => {
        const schedulesData = response.data.map((schedule) => ({
          id: schedule.scheduleID,
          time: `${schedule.startTime} - ${schedule.endTime}`,
        }));
        setSchedules(schedulesData);
      })
      .catch((error) => console.error('Error fetching schedules:', error));
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (!cancelReason) {
      setError('Debe ingresar una razón para cancelar la cita.');
      return;
    }

    const today = dayjs().format('YYYY-MM-DD');

    try {
      await axios.delete(`http://localhost:5281/api/ExtendedAppointment/${appointmentToCancel.appointmentID}`);

      if (dayjs(appointmentToCancel.appointmentDate).format('YYYY-MM-DD') === today) {
        await axios.patch(`http://localhost:5281/api/Availability/${appointmentToCancel.scheduleID}`, {
          isAvailable: true,
        });
      }

      const userEmail = await fetchUserEmail(appointmentToCancel.userID);
      const email = userEmail;
      const subject = 'Cancelación de cita';
      const schedule = schedules.find((s) => s.id === appointmentToCancel.scheduleID);
      const timeSlot = schedule ? schedule.time : 'N/A';
      const emailData = `En el centro oftalmológico lamenta informar que la cita programada para el 
        ${appointmentToCancel.appointmentDate} a las ${timeSlot} se cancela por el siguiente motivo: ${cancelReason}`;

      const emailResponse = await axios.post(
        `http://localhost:5281/api/Email/send?toEmail=${email}&subject=${subject}&message=${emailData}`
      );

      if (emailResponse.status === 200) {
        message.success('La cita fue cancelada y el correo ha sido enviado.');
      } else {
        message.error('La cita fue cancelada, pero no se pudo enviar el correo.');
      }

      setAppointments(appointments.filter((app) => app.appointmentID !== appointmentToCancel.appointmentID));
      setShowModal(false);
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Error al cancelar la cita.');
    }
  };

  const filteredAppointments = selectedDate
    ? appointments.filter((appointment) => dayjs(appointment.appointmentDate).format('YYYY-MM-DD') === selectedDate)
    : appointments;

  const columns = [
    {
      title: 'Nombre del Paciente',
      dataIndex: 'patientName',
      key: 'patientName',
      width: 200,
    },
    {
      title: 'Fecha',
      dataIndex: 'appointmentDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Horario',
      dataIndex: 'scheduleID',
      render: (scheduleID) => {
        const schedule = schedules.find((s) => s.id === scheduleID);
        return schedule ? schedule.time : 'N/A';
      },
    },
    {
      title: 'Sintomas',
      dataIndex: 'symptoms',
    },
    {
      title: 'Servicio',
      dataIndex: 'serviceType',
    },
    {
      title: 'Doctor Doctora',
      dataIndex: 'doctorName',
    },
    {
      title: 'Acciones',
      render: (appointment) => (
        <Button
          danger
          onClick={() => handleCancelClick(appointment)}
        >
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

            <DatePicker
              onChange={handleDateChange}
              style={{ marginBottom: 20 }}
            />

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
        {error && <Typography.Text type='danger'>{error}</Typography.Text>}
      </Modal>
    </Layout>
  );
}

export default Appointments;
