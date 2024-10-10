'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, Select, DatePicker, Alert, Typography, Steps, ConfigProvider, message } from 'antd';
import moment from 'moment';
import Map from '../components/Map';

const { Title, Text } = Typography;
const { Step } = Steps;

function ScheduleAppointment() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: '',
    patientBirthday: '',
    symptoms: '',
    serviceType: '',
    availabilityID: '',
    selectedTime: '',
    appointmentDate: '',
    status: 'Scheduled',
    description: '',
    doctorName: '',
  });
  const [LOCATION, setLOCATION] = useState({ lat: 0, lng: 0 });
  const [availabilities, setAvailabilities] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [previousAvailability, setPreviousAvailability] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
  
    if (!session || !session.userId) {
      return;
    }
    axios
      .get('http://localhost:5281/api/Availability')
      .then((response) => setAvailabilities(response.data))
      .catch(error => console.error('Error fetching availabilities:', error));

    axios
      .get('http://localhost:5281/api/AppointmentService')
      .then((response) => setServices(response.data))
      .catch(error => console.error('Error fetching services:', error));

    axios
      .get('http://localhost:5281/api/Doctor')
      .then((response) => setDoctors(response.data))
      .catch(error => console.error('Error fetching doctor:', error));

    axios
      .get('http://localhost:5281/api/LocationCenter')
      .then((response) => {
        const location = response.data[0];
        setLOCATION({ lat: location.latitude, lng: location.longitude });
      })
      .catch((error) => console.error(error));
  }, [session, status]);

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
    if (!session || !session.userId) {
      message.error('No se ha iniciado sesión. Por favor, inicia sesión primero.');
      return;
    }
    if (!validateDate(formData.birthDate)) {
      message.error('La fecha de nacimiento no puede ser una fecha futura.');
      return;
    }

    if (step === 1) {
      if (!validateTime(selectedAvailability)) {
        message.error('El horario seleccionado ya ha pasado.');
        return;
      }
      setStep(2);
    } else {
      const todayDate = new Date().toISOString().split('T')[0];

      axios
        .post('http://localhost:5281/api/Appointment', {
          ...formData,
          userID: session.userId,
          availabilityID: formData.availabilityID,
          appointmentDate: todayDate,
          status: formData.status,
          description: formData.description,
          patientName: formData.patientName,
          patientBirthday: formData.patientBirthday,
          symptoms: formData.symptoms,
          serviceType: formData.serviceType,
          doctorName: formData.doctorName,
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

          router.push('/pagina-citas');
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
    } else {
      setFormData((prevData) => ({
        ...prevData,
        availabilityID: '',
        selectedTime: '',
      }));
      setSelectedAvailability(null);
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
    router.push('/pagina-citas');
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
      <div style={{ backgroundColor: '#f0f2f5', padding: '20px' }}>
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
                <Input onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} />
              </Form.Item>
              <Form.Item
                label='Fecha de Nacimiento'
                name='birthDate'
                rules={[{ required: true, message: 'Por favor, selecciona tu fecha de nacimiento' }]}
              >
                <DatePicker
                  format='YYYY-MM-DD'
                  onChange={(date, dateString) => setFormData({ ...formData, patientBirthday: dateString })}
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
                  {services.map((service) => (
                    <Select.Option
                      key={service.serviceID}
                      value={service.serviceType}
                    >
                      {service.serviceType}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label='Doctor Doctora'
                name='doctorName'
                rules={[{ required: true, message: 'Selecciona al Doctor Doctora.' }]}
              >
                <Select onChange={(value) => setFormData({ ...formData, doctorName: value })}>
                  {doctors.map((doctor) => (
                    <Select.Option
                      key={doctor.doctorID}
                      value={doctor.doctorName}
                    >
                      {doctor.doctorName}
                    </Select.Option>
                  ))}
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
                style={{ margin: '10px' }}
              >
                Confirmar
              </Button>
              <Button
                type='primary'
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
        {LOCATION.lat !== 0 && LOCATION.lng !== 0 && (
          <Map
            center={LOCATION}
            zoom={16}
          />
        )}
      </div>
    </ConfigProvider>
  );
}

export default ScheduleAppointment;
