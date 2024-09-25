'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Select, DatePicker, Alert, Typography, Steps } from 'antd';
import moment from 'moment';
import Map from '../components/Map';

const { Title, Text } = Typography;
const { Step } = Steps;

const LOCATION = { lat: -17.38907923125398, lng: -66.15522088392129 };

function ScheduleAppointment() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    symptoms: '',
    serviceType: '',
    availabilityID: '',
    selectedTime: '',
  });
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [previousAvailability, setPreviousAvailability] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5281/api/Availability')
      .then((response) => setAvailabilities(response.data))
      .catch((error) => console.error(error));
  }, []);

  const validateDate = (date) => {
    const today = moment().startOf('day');
    const inputDate = moment(date).startOf('day');
    return inputDate.isSameOrBefore(today);
  };

  const validateTime = (selected) => {
    const now = new Date();
    const today = new Date().toISOString().split('T')[0];

    if (!selected) return false;

    const startDateTime = new Date(`${today}T${selected.startTime}`);
    return now < startDateTime;
  };

  const handleSubmit = (values) => {
    if (!validateDate(formData.birthDate)) {
      setError('La fecha de nacimiento no puede ser una fecha futura.');
      return;
    }

    if (step === 1) {
      if (!validateTime(selectedAvailability)) {
        setError('El horario seleccionado ya ha pasado.');
        return;
      }
      setStep(2);
    } else {
      const todayDate = new Date().toISOString().split('T')[0];

      axios
        .post('http://localhost:5281/api/Appointment', {
          ...formData,
          appointmentDate: todayDate,
          status: 'Scheduled',
          description: formData.symptoms,
        })
        .then(() => {
          if (formData.availabilityID) {
            axios
              .patch(`http://localhost:5281/api/Availability/${formData.availabilityID}`, {
                isAvailable: false,
              })
              .catch((error) => console.error(error));
          }

          if (previousAvailability) {
            axios
              .patch(`http://localhost:5281/api/Availability/${previousAvailability.availabilityID}`, {
                isAvailable: true,
              })
              .catch((error) => console.error(error));
          }

          router.push('/reserva-cita');
        })
        .catch((error) => console.error(error));
    }
  };

  const handleAvailabilityChange = (value) => {
    const selected = availabilities.find((avail) => avail.availabilityID === parseInt(value, 10));

    if (selected) {
      if (selectedAvailability) {
        setPreviousAvailability(selectedAvailability);
      }

      setFormData((prevData) => ({
        ...prevData,
        availabilityID: value,
        selectedTime: `${selected.startTime} - ${selected.endTime}`,
      }));
      setSelectedAvailability(selected);
      setError('');
    } else {
      setFormData((prevData) => ({
        ...prevData,
        availabilityID: '',
        selectedTime: '',
      }));
      setSelectedAvailability(null);
      setError('');
    }
  };

  const handleCancel = () => {
    if (selectedAvailability) {
      axios
        .patch(`http://localhost:5281/api/Availability/${selectedAvailability.availabilityID}`, {
          isAvailable: true,
        })
        .catch((error) => console.error(error));
    }
    router.push('/reserva-cita');
  };

  const availableTimes = availabilities.filter((availability) => availability.isAvailable);

  const isTimeInThePast = (startTime) => {
    const now = new Date();
    const [hours, minutes] = startTime.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time < now;
  };

  return (
    <div className='p-6 bg-gray-100 min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        {error && (
          <Alert
            message={error}
            type='error'
            showIcon
            className='mb-4'
          />
        )}
        <Steps
          current={step - 1}
          className='mb-6'
        >
          <Step title='Información del Paciente' />
          <Step title='Confirmación' />
        </Steps>
        {step === 1 ? (
          <Form
            onFinish={handleSubmit}
            layout='vertical'
          >
            <Form.Item
              label='Nombre'
              name='name'
              rules={[{ required: true, message: 'Por favor, ingresa tu nombre' }]}
            >
              <Input onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Form.Item>
            <Form.Item
              label='Fecha de Nacimiento'
              name='birthDate'
              rules={[{ required: true, message: 'Por favor, selecciona tu fecha de nacimiento' }]}
            >
              <DatePicker
                format='YYYY-MM-DD'
                onChange={(date, dateString) => setFormData({ ...formData, birthDate: dateString })}
                disabledDate={(current) => current && current > moment().endOf('day')}
              />
            </Form.Item>
            <Form.Item
              label='Síntomas'
              name='symptoms'
              rules={[{ required: true, message: 'Por favor, describe tus síntomas' }]}
            >
              <Input.TextArea onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} />
            </Form.Item>
            <Form.Item
              label='Tipo de Servicio'
              name='serviceType'
              rules={[{ required: true, message: 'Por favor, selecciona un tipo de servicio' }]}
            >
              <Select onChange={(value) => setFormData({ ...formData, serviceType: value })}>
                <Select.Option value='eyeExam'>Examen de la Vista</Select.Option>
                <Select.Option value='fundusExam'>Examen de Fondo de Ojo</Select.Option>
                <Select.Option value='refraction'>Refracción</Select.Option>
                <Select.Option value='pressureControl'>Control de Presión Ocular</Select.Option>
                <Select.Option value='contactLens'>Consulta para Lentes de Contacto</Select.Option>
                <Select.Option value='refractiveSurgery'>Consulta para Cirugía Refractiva</Select.Option>
                <Select.Option value='cataractAssessment'>Evaluación de Cataratas</Select.Option>
                <Select.Option value='postOpFollowUp'>Consulta de Seguimiento Postoperatorio</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='Horario Disponible'
              name='availabilityID'
              rules={[{ required: true, message: 'Por favor, selecciona un horario disponible' }]}
            >
              <Select onChange={handleAvailabilityChange}>
                <Select.Option value=''>Selecciona un horario</Select.Option>
                {availableTimes.map((availability) => (
                  <Select.Option
                    key={availability.availabilityID}
                    value={availability.availabilityID}
                    disabled={isTimeInThePast(availability.startTime)}
                  >
                    {`${availability.startTime} - ${availability.endTime}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
              >
                Siguiente
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <Title
              level={2}
              className='text-red-600'
            >
              Confirmación
            </Title>
            <Text>
              <strong>Razón de la Visita:</strong> {formData.symptoms}
            </Text>
            <br />
            <Text>
              <strong>Fecha de Nacimiento:</strong> {formData.birthDate}
            </Text>
            <br />
            <Text>
              <strong>Tipo de Servicio:</strong> {formData.serviceType}
            </Text>
            <br />
            <Text>
              <strong>Horario Seleccionado:</strong> {formData.selectedTime}
            </Text>
            <br />
            <Button
              type='primary'
              onClick={handleSubmit}
            >
              Confirmar
            </Button>
            <Button
              onClick={handleCancel}
              className='ml-4'
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
      <div className='map-container'>
        <Map
          center={LOCATION}
          zoom={16}
        />
      </div>
    </div>
  );
}

export default ScheduleAppointment;
