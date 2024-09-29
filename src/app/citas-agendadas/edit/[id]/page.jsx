'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card, Typography, Select, Modal, Input, Spin, message } from 'antd';
import Map from '../../../components/Map';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const LOCATION = { lat: -17.38907923125398, lng: -66.15522088392129 };

function EditAppointment() {
  const router = useRouter();
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailabilityID, setNewAvailabilityID] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5281/api/Appointment/${id}`)
        .then((response) => {
          setAppointment(response.data);
          if (response.data.availabilityID) {
            axios
              .get(`http://localhost:5281/api/Availability/${response.data.availabilityID}`)
              .then((resp) => {
                setNewAvailabilityID(resp.data.availabilityID);
                setSelectedAvailability(resp.data);
              })
              .catch((error) => console.error('Error fetching availability:', error));
          }
        })
        .catch((error) => console.error('Error fetching appointment:', error));

      axios
        .get('http://localhost:5281/api/Availability')
        .then((response) => {
          const availableSlots = response.data.filter((slot) => slot.isAvailable);
          setAvailabilities(availableSlots);
        })
        .catch((error) => console.error('Error fetching availability:', error));
    }
  }, [id]);

  const handleUpdate = () => {
    if (newAvailabilityID === '') {
      setError('Debe seleccionar un nuevo horario.');
      return;
    }
    axios
      .put('http://localhost:5281/api/Appointment', {
        ...appointment,
        availabilityID: newAvailabilityID,
        status: 'Updated',
      })
      .then(() => router.push('/reserva-cita'))
      .catch((error) => console.error('Error updating appointment:', error));
  };

  const handleCancel = () => setShowModal(true);

  const confirmCancel = () => {
    if (!cancelReason) {
      message.warning('Debe ingresar una razón para cancelar la cita.');
      return;
    }
    
    axios
      .delete(`http://localhost:5281/api/Appointment/${id}`)
      .then(() => {
        if (appointment.availabilityID) {
          axios
            .patch(`http://localhost:5281/api/Availability/${appointment.availabilityID}`, {
              isAvailable: true
            })
            .then(() => {
              router.push('/reserva-cita');
            })
            .catch((error) => console.error('Error updating availability:', error));
        } else {
          router.push('/reserva-cita');
        }
      })
      .catch((error) => console.error('Error deleting appointment:', error));
  };

  const isTimeInThePast = (startTime) => {
    const now = new Date();
    const [hours, minutes] = startTime.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time < now;
  };

  return appointment ? (
    <div className='min-h-screen p-6 flex items-center justify-center relative'>
      <Card
        title={
          <Title
            level={2}
            className='text-red-600'
          >
            Editar Cita
          </Title>
        }
        bordered={false}
      >
        <Paragraph>Fecha de Cita: {new Date(appointment.appointmentDate).toLocaleDateString('en-CA')}</Paragraph>
        {selectedAvailability && (
          <Paragraph>Horario: {selectedAvailability.startTime} - {selectedAvailability.endTime}</Paragraph>
        )}
        <Select
          placeholder='Seleccione un nuevo horario'
          onChange={(value) => {
            setNewAvailabilityID(value);
            const selected = availabilities.find(slot => slot.availabilityID === value);
            setSelectedAvailability(selected);
          }}
          style={{ width: '100%' }}
        >
          {availabilities.map((availability) => (
            <Option
              key={availability.availabilityID}
              value={availability.availabilityID}
              disabled={isTimeInThePast(availability.startTime)}
            >
              {`${availability.startTime} - ${availability.endTime}`}
            </Option>
          ))}
        </Select>
        {error && <Paragraph type='danger'>{error}</Paragraph>}
        <Button
          type='primary'
          className='mt-4'
          onClick={handleUpdate}
        >
          Actualizar
        </Button>
        <Button
          type='danger'
          className='mt-4 ml-2'
          onClick={handleCancel}
        >
          Cancelar Cita
        </Button>

        <div className='mt-6'>
          <Title level={4}>Ubicación del Centro de Atención</Title>
          <div className='map-container'>
            <Map
              center={LOCATION}
              zoom={16}
            />
          </div>
        </div>

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
        </Modal>
      </Card>
    </div>
  ) : (
    <Spin tip='Cargando...'>
      <p>Cargando detalles de la cita...</p>
    </Spin>
  );
}

export default EditAppointment;
