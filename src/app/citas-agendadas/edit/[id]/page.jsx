'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Button, Form, Input, Select, DatePicker, Alert, Typography, Modal, message, ConfigProvider } from 'antd';
import moment from 'moment';
import Map from '../../../components/Map';
import { fetchUserAccessToken } from '@/app/services/keycloakServices';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

function EditAppointment() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    appointmentID: '',
    userID: 0,
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
  const [showModal, setShowModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session || !session.userId) {
      setLoading(false);
      signIn('keycloak');
    }

    if (id) {
      fetchData(id);
    }
  }, [id, session, status]);

  const fetchData = async (id) => {
    const token = await fetchUserAccessToken();
    console.log(token);

    try {
      const appointmentResponse = await axios.get(`http://localhost:5270/viscenter/api/v1/Appointment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const appointmentData = appointmentResponse.data;
      setFormData({
        userID: appointmentData.userID,
        appointmentID: appointmentData.appointmentID,
        patientName: appointmentData.patientName,
        patientBirthday: appointmentData.patientBirthday,
        symptoms: appointmentData.symptoms,
        serviceType: appointmentData.serviceType,
        availabilityID: appointmentData.availabilityID,
        selectedTime: `${appointmentData.startTime} - ${appointmentData.endTime}`,
        appointmentDate: appointmentData.appointmentDate,
        status: appointmentData.status,
        description: appointmentData.description,
        doctorName: appointmentData.doctorName,
      });
      setPreviousAvailability(appointmentData.availabilityID);

      const availabilityResponse = await axios.get('http://localhost:5270/viscenter/api/v1/Availability', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailabilities(availabilityResponse.data.filter((slot) => slot.isAvailable));

      const servicesResponse = await axios.get('http://localhost:5270/viscenter/api/v1/AppointmentService', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(servicesResponse.data);

      const doctorsResponse = await axios.get('http://localhost:5270/viscenter/api/v1/Doctor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(doctorsResponse.data);

      const locationResponse = await axios.get('http://localhost:5270/viscenter/api/v1/LocationCenter', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const location = locationResponse.data[0];
      setLOCATION({ lat: location.latitude, lng: location.longitude });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  const handleUpdate = async () => {
    const token = await fetchUserAccessToken();
    console.log(token);

    if (!validateDate(formData.patientBirthday)) {
      message.error('La fecha de nacimiento no puede ser una fecha futura.');
      return;
    }

    const availabilityToUpdate = formData.availabilityID || previousAvailability;

    if (selectedAvailability && selectedAvailability.availabilityID !== previousAvailability) {
      if (!validateTime(selectedAvailability)) {
        message.error('El horario seleccionado ya ha pasado.');
        return;
      }
    }

    axios
      .put(
        'http://localhost:5270/viscenter/api/v1/Appointment',
        {
          userID: session.userId,
          availabilityID: availabilityToUpdate,
          appointmentDate: formData.appointmentDate,
          status: formData.status,
          description: formData.description,
          patientName: formData.patientName,
          patientBirthday: formData.patientBirthday,
          symptoms: formData.symptoms,
          serviceType: formData.serviceType,
          description: formData.description,
          appointmentID: formData.appointmentID,
          doctorName: formData.doctorName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        if (previousAvailability && previousAvailability !== formData.availabilityID) {
          axios.patch(
            `http://localhost:5270/viscenter/api/v1/Availability/${previousAvailability}`,
            {
              isAvailable: true,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        if (availabilityToUpdate !== previousAvailability) {
          axios
            .patch(
              `http://localhost:5270/viscenter/api/v1/Availability/${availabilityToUpdate}`,
              {
                isAvailable: false,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              router.push('/pagina-citas');
            })
            .catch((error) => console.error('Error updating new availability:', error));
        } else {
          router.push('/pagina-citas');
        }
      })
      .catch((error) => console.error('Error updating appointment:', error));
  };

  const handleCancel = () => setShowModal(true);

  const confirmCancel = async () => {
    const token = await fetchUserAccessToken();
    console.log(token);

    if (!cancelReason) {
      message.warning('Debe ingresar una razón para cancelar la cita.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5270/viscenter/api/v1/Appointment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (formData.availabilityID) {
        await axios.patch(
          `http://localhost:5270/viscenter/api/v1/Availability/${formData.availabilityID}`,
          {
            isAvailable: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const email = process.env.NEXT_PUBLIC_VISCENTER_EMAIL;
      const subject = 'Cancelación de cita';
      const availability = availabilities[formData.availabilityID];
      const timeSlot = availability ? `${availability.startTime} - ${availability.endTime}` : 'N/A';
      const EmailData = `El usuario ${session.user?.email} a cancelado la cita del ${formData.appointmentDate} a las ${timeSlot} 
        por el siguiente motivo: ${cancelReason}`;
      const emailResponse = await axios.post(
        `http://localhost:5270/viscenter/api/v1/Email/send?toEmail=${email}&subject=${subject}&message=${EmailData}`,
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

      router.push('/pagina-citas');
    } catch (error) {
      console.error('Error cancelando cita:', error);
      message.error('Hubo un error al cancelar la cita.');
    }
  };

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
    <Header/>
      <div
        style={{ backgroundColor: '#f0f2f5', padding: '20px' }}
        className='min-h-screen p-6 flex items-center justify-center'
      >
        <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
          {error && (
            <Alert
              message={error}
              type='error'
              showIcon
              className='mb-4'
            />
          )}
          <Title
            level={2}
            className='text-red-600'
          >
            Editar Cita
          </Title>
          <Form
            layout='vertical'
            onFinish={handleUpdate}
          >
            <Form.Item
              label='Nombre'
              required
            >
              <Input
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              />
            </Form.Item>
            <Form.Item
              label='Fecha de Nacimiento'
              required
            >
              <DatePicker
                format='YYYY-MM-DD'
                value={moment(formData.patientBirthday)}
                onChange={(date, dateString) => setFormData({ ...formData, patientBirthday: dateString })}
                disabledDate={(current) => current && current > moment().endOf('day')}
              />
            </Form.Item>
            <Form.Item
              label='Síntomas'
              required
            >
              <Input.TextArea
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              />
            </Form.Item>
            <Form.Item
              label='Tipo de Servicio'
              required
            >
              <Select
                value={formData.serviceType}
                onChange={(value) => setFormData({ ...formData, serviceType: value })}
              >
                {services.map((service) => (
                  <Option
                    key={service.serviceID}
                    value={service.serviceType}
                  >
                    {service.serviceType}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label='Doctor Doctora'
              required
            >
              <Select
                value={formData.doctorName}
                onChange={(value) => setFormData({ ...formData, doctorName: value })}
              >
                {doctors.map((doctor) => (
                  <Option
                    key={doctor.doctorID}
                    value={doctor.doctorName}
                  >
                    {doctor.doctorName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label='Horario Disponible'
              name='availabilityID'
              initialValue={availabilities.length > 0 ? availabilities[0].availabilityID : ''}
              rules={[{ required: false, message: 'Por favor, selecciona un horario disponible' }]}
            >
              <Select
                defaultValue={availabilities.length > 0 ? availabilities[0].availabilityID : ''}
                onChange={(value) => {
                  const selected = availabilities.find((avail) => avail.availabilityID === parseInt(value, 10));
                  if (selected) {
                    setSelectedAvailability(selected);
                    setFormData((prevData) => ({
                      ...prevData,
                      availabilityID: value,
                      selectedTime: `${selected.startTime} - ${selected.endTime}`,
                    }));
                    setError('');
                  } else {
                    setSelectedAvailability(null);
                    setFormData((prevData) => ({
                      ...prevData,
                      availabilityID: '',
                      selectedTime: '',
                    }));
                    setError('');
                  }
                }}
              >
                <Option value=''>Selecciona un horario</Option>
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
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                style={{ margin: '10px' }}
              >
                Actualizar Cita
              </Button>
              <Button
                danger
                className='ml-2'
                onClick={handleCancel}
              >
                Cancelar Cita
              </Button>
            </Form.Item>
          </Form>

          <Modal
            title='Confirmar Cancelación'
            open={showModal}
            onOk={confirmCancel}
            onCancel={() => setShowModal(false)}
          >
            <Input.TextArea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder='Razón de la cancelación'
            />
          </Modal>

          <div className='mt-6'>
            <Title level={4}>Ubicación del Centro de Atención</Title>
            {LOCATION.lat !== 0 && LOCATION.lng !== 0 && (
              <Map
                center={LOCATION}
                zoom={16}
              />
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </ConfigProvider>
  );
}

export default EditAppointment;
