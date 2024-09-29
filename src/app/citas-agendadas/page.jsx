'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { List, Card, Button, Typography, Spin } from 'antd';

const { Title, Paragraph } = Typography;

function ScheduledAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDate] = useState(new Date().toLocaleDateString('en-CA'));
  const router = useRouter();

  useEffect(() => {
    axios.get('http://localhost:5281/api/Appointment')
      .then(response => {
        const appointmentsData = response.data;
        setAppointments(appointmentsData);

        const availabilityIds = appointmentsData.map(app => app.availabilityID);
        return axios.get('http://localhost:5281/api/Availability').then(response => {
          const availabilitiesData = response.data;
          const availabilityMap = availabilitiesData.reduce((map, item) => {
            map[item.availabilityID] = item;
            return map;
          }, {});
          setAvailabilities(availabilityMap);
        });
      })
      .catch(error => console.error('Error fetching appointments:', error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEdit = (appointmentID) => {
    router.push(`/citas-agendadas/edit/${appointmentID}`);
  };

  const handleConsultCalendar = () => {
    router.push('/calendario-citas');
  };

  const handleConsultAppointmentDay = () => {
    router.push('/agendar-cita');
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString('en-CA');
    return appointmentDate === currentDate;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card title={<Title level={2} className="text-red-600">Citas Agendadas</Title>} bordered={false}>
        {loading ? (
          <Spin tip="Cargando citas...">
            <p>Cargando citas...</p>
          </Spin>
        ) : (
          filteredAppointments.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={filteredAppointments}
              renderItem={(appointment) => {
                const availability = availabilities[appointment.availabilityID] || {};
                return (
                  <List.Item key={appointment.appointmentID}>
                    <Card
                      type="inner"
                      title={`Fecha: ${new Date(appointment.appointmentDate).toLocaleDateString('en-CA')}`}
                      extra={availability.startTime && `Horario: ${availability.startTime} - ${availability.endTime}`}
                      actions={[
                        <Button type="primary" onClick={() => handleEdit(appointment.appointmentID)}>Editar</Button>,
                      ]}
                    >
                      <Paragraph>Descripción: {appointment.serviceType}</Paragraph>
                    </Card>
                  </List.Item>
                );
              }}
            />
          ) : (
            <>
              <p>No hay citas agendadas desde citas del Día.</p>
              <p>
                Consulta el <Button type="link" onClick={handleConsultCalendar}>calendario de citas</Button> para ver las citas hechas desde el calendario.
              </p>
              <p>
                O crea una cita del día en <Button type="link" onClick={handleConsultAppointmentDay}>agendar citas</Button> para agendar una nueva cita.
              </p>
            </>
          )
        )}
      </Card>
    </div>
  );
}

export default ScheduledAppointments;
