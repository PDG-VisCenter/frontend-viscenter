'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { List, Card, Button, Typography, Spin, ConfigProvider } from 'antd';
import { fetchUserAccessToken } from '../services/keycloakServices';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const { Title, Paragraph } = Typography;

function ScheduledAppointments() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDate] = useState(new Date().toLocaleDateString('en-CA'));
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!session || !session.userId) {
      signIn('keycloak');
    }

    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    const token = await fetchUserAccessToken();

    axios
      .get(`http://localhost:5270/viscenter/api/v1/Appointment/user/${session.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const appointmentsData = response.data;
        setAppointments(appointmentsData);

        const availabilityIds = appointmentsData.map((app) => app.availabilityID);
        return axios.get('http://localhost:5270/viscenter/api/v1/Availability', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          const availabilitiesData = response.data;
          const availabilityMap = availabilitiesData.reduce((map, item) => {
            map[item.availabilityID] = item;
            return map;
          }, {});
          setAvailabilities(availabilityMap);
        });
      })
      .catch((error) => console.error('Error fetching appointments:', error))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEdit = (appointmentID) => {
    router.push(`/citas-agendadas/edit/${appointmentID}`);
  };

  const handleConsultCalendar = () => {
    router.push('/calendario-citas');
  };

  const handleConsultAppointmentDay = () => {
    router.push('/agendar-cita');
  };

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
    <Header/>
      <div
        style={{ backgroundColor: '#f0f2f5', padding: '20px', minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between' }}
        className='min-h-screen bg-gray-100 p-6'
      >
        <Card
          title={
            <Title
              level={2}
              className='text-red-600'
            >
              Citas Agendadas
            </Title>
          }
          bordered={false}
        >
          {loading ? (
            <Spin tip='Cargando citas...'>
              <p>Cargando citas...</p>
            </Spin>
          ) : appointments.length > 0 ? (
            <List
              itemLayout='vertical'
              dataSource={appointments}
              renderItem={(appointment) => {
                const availability = availabilities[appointment.availabilityID] || {};
                return (
                  <List.Item key={appointment.appointmentID}>
                    <Card
                      type='inner'
                      title={`Fecha: ${new Date(appointment.appointmentDate).toLocaleDateString('en-CA')}`}
                      extra={availability.startTime && `Horario: ${availability.startTime} - ${availability.endTime}`}
                      actions={[
                        <Button
                          type='primary'
                          onClick={() => handleEdit(appointment.appointmentID)}
                        >
                          Editar
                        </Button>,
                      ]}
                    >
                      <Paragraph>Tipo de servicio: {appointment.serviceType}</Paragraph>
                    </Card>
                  </List.Item>
                );
              }}
            />
          ) : (
            <>
              <p>No hay citas agendadas desde citas del Día.</p>
              <p>
                Consulta el{' '}
                <Button
                  type='link'
                  onClick={handleConsultCalendar}
                >
                  calendario de citas
                </Button>{' '}
                para ver las citas hechas desde el calendario.
              </p>
              <p>
                O crea una cita del día en{' '}
                <Button
                  type='link'
                  onClick={handleConsultAppointmentDay}
                >
                  agendar citas
                </Button>{' '}
                para agendar una nueva cita.
              </p>
            </>
          )}
        </Card>
      </div>
    <Footer/>
    </ConfigProvider>
  );
}

export default ScheduledAppointments;
