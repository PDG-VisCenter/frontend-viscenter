'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, theme, Table, Button, Modal, Input, Typography, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import dayjs from 'dayjs';
import { fetchUserEmail } from '@/app/services/keycloakServices';
import { fetchUserAccessToken } from '@/app/services/keycloakServices';
import { signIn, useSession } from 'next-auth/react';

const { Title } = Typography;

function Appointments() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [error, setError] = useState('');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
        .get('http://localhost:5270/viscenter/api/v1/Appointment', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const appointmentsData = response.data;
          setAppointments(appointmentsData);

          const availabilityIds = appointmentsData.map((app) => app.availabilityID);
          axios
            .get('http://localhost:5270/viscenter/api/v1/Availability', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const availabilitiesData = response.data;
              const availabilityMap = availabilitiesData.reduce((map, item) => {
                map[item.availabilityID] = item;
                return map;
              }, {});
              setAvailabilities(availabilityMap);
            })
            .catch((error) => console.error('Error fetching availabilities:', error));
        })
        .catch((error) => console.error('Error fetching appointments:', error));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    const token = await fetchUserAccessToken();
    console.log(token);

    if (!cancelReason) {
      setError('Debe ingresar una razón para cancelar la cita.');
      return;
    }

    const availabilityID = appointmentToCancel.availabilityID;
    const userID = appointmentToCancel.userID;

    try {
      await axios.delete(`http://localhost:5270/viscenter/api/v1/Appointment/${appointmentToCancel.appointmentID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await axios.patch(
        `http://localhost:5270/viscenter/api/v1/Availability/${availabilityID}`,
        {
          isAvailable: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userEmail = await fetchUserEmail(userID);
      const email = userEmail;
      const subject = 'Cancelación de cita';
      const availability = availabilities[availabilityID];
      const timeSlot = availability ? `${availability.startTime} - ${availability.endTime}` : 'N/A';
      const emailData = `El centro oftalmológico lamenta informar que la cita programada para el 
      ${appointmentToCancel.appointmentDate} a las ${timeSlot} se cancela por el siguiente motivo: ${cancelReason}`;

      const emailResponse = await axios.post(
        `http://localhost:5270/viscenter/api/v1/Email/send?toEmail=${email}&subject=${subject}&message=${emailData}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      console.error('Error cancelling appointment or sending email:', error);
      setError('Error al cancelar la cita o enviar el correo.');
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
      dataIndex: 'availabilityID',
      render: (availabilityID) => {
        const availability = availabilities[availabilityID];
        return availability ? `${availability.startTime} - ${availability.endTime}` : 'N/A';
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
        <SiderMenuSeller selectedItem='6' />
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
