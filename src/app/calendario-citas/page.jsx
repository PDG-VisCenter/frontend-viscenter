'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import moment from 'moment';
import { Calendar as AntCalendar, Modal, Form, Input, DatePicker, Select, Button, message } from 'antd';

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

const serviceTypes = [
  { value: 'eyeExam', label: 'Examen de la Vista' },
  { value: 'fundusExam', label: 'Examen de Fondo de Ojo' },
  { value: 'refraction', label: 'Refracción' },
  { value: 'pressureControl', label: 'Control de Presión Ocular' },
  { value: 'contactLens', label: 'Consulta para Lentes de Contacto' },
  { value: 'refractiveSurgery', label: 'Consulta para Cirugía Refractiva' },
  { value: 'cataractAssessment', label: 'Evaluación de Cataratas' },
  { value: 'postOpFollowUp', label: 'Consulta de Seguimiento Postoperatorio' },
];

const ExtendedAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDayAppointmentModal, setShowDayAppointmentModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [formData, setFormData] = useState({
    appointmentID: 0,
    userID: 1,
    appointmentDate: '',
    status: 'Scheduled',
    description: '',
    scheduleID: schedules[0].id,
    serviceType: '',
    name: '',
    birthDate: '',
  });
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5281/api/ExtendedAppointment');
      const formattedAppointments = response.data.map((appointment) => ({
        ...appointment,
        appointmentDate: moment(appointment.appointmentDate).format('YYYY-MM-DD'),
        title: appointment.status === 'Scheduled' ? 'Cita Agendada' : 'Cita Cancelada',
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      message.error('Error al obtener las citas');
    }
  };

  const handleDateClick = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');
    const sevenDaysFromNow = moment().add(7, 'days').format('YYYY-MM-DD');

    if (formattedDate < today) {
      message.warning('No es posible agendar citas en fechas pasadas.');
      return;
    }

    if (formattedDate > sevenDaysFromNow) {
      message.warning('No se puede agendar citas a más de una semana de distancia.');
      return;
    }

    if (formattedDate === today) {
      const existingAppointment = appointments.find((app) => app.appointmentDate === formattedDate);

      if (existingAppointment) {
        setCurrentAppointment(existingAppointment);
        setShowDayAppointmentModal(true);
      } else {
        router.push('/agendar-cita');
      }
      return;
    }

    const existingAppointment = appointments.find((app) => app.appointmentDate === formattedDate);

    if (existingAppointment) {
      handleEventClick(existingAppointment);
    } else {
      setSelectedDate(date);
      setFormData({
        appointmentID: 0,
        userID: 1,
        appointmentDate: formattedDate,
        status: 'Scheduled',
        description: '',
        scheduleID: schedules[0].id,
        serviceType: '',
        name: '',
        birthDate: '',
      });
      setShowForm(true);
      form.resetFields();
    }
  };

  const handleEventClick = (event) => {
    setSelectedDate(moment(event.appointmentDate));
    setFormData({
      appointmentID: event.appointmentID,
      userID: event.userID,
      appointmentDate: event.appointmentDate,
      status: event.status,
      description: event.description,
      scheduleID: event.scheduleID,
      serviceType: event.serviceType,
      name: event.name,
      birthDate: event.birthDate,
    });
    setShowForm(true);
    form.setFieldsValue(event);
  };

  const handleFormSubmit = async (values) => {
    const updatedData = { ...formData, ...values };

    try {
      if (updatedData.appointmentID) {
        await axios.put('http://localhost:5281/api/ExtendedAppointment', updatedData);
        message.success('Cita actualizada correctamente');
      } else {
        await axios.post('http://localhost:5281/api/ExtendedAppointment', updatedData);
        message.success('Cita agendada correctamente');
      }
      fetchAppointments();
      setShowForm(false);
    } catch (error) {
      message.error('Error al enviar los datos del formulario');
    }
  };

  const handleDelete = () => {
    setShowCancelModal(true);
  };

  const confirmDelete = async () => {
    if (!cancelReason) {
      message.warning('El motivo de la cancelación es obligatorio.');
      return;
    }

    const today = moment().format('YYYY-MM-DD');

    try {
      await axios.delete(`http://localhost:5281/api/ExtendedAppointment/${formData.appointmentID}`);

      if (formData.appointmentDate === today) {
        await axios.patch(`http://localhost:5281/api/Availability/${formData.scheduleID}`, {
          isAvailable: true,
        });
      } else {
        console.log("drogas");
      }

      fetchAppointments();
      message.success('Cita eliminada correctamente');
      setShowForm(false);
      setCancelReason('');
    } catch (error) {
      message.error('Error eliminando la cita');
    } finally {
      setShowCancelModal(false);
    }
  };

  const dateCellRender = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const appointmentForDate = appointments.find((app) => app.appointmentDate === formattedDate);

    return appointmentForDate ? (
      <div style={{ backgroundColor: '#f0f0f0', padding: '8px' }}>
        <strong>{appointmentForDate.title}</strong>
        <br />
        {schedules.find((s) => s.id === appointmentForDate.scheduleID)?.time}
      </div>
    ) : null;
  };

  const handleConvertToDailyAppointment = async () => {
    const newAppointmentData = {
      appointmentID: 0,
      userID: currentAppointment.userID,
      availabilityID: currentAppointment.scheduleID,
      appointmentDate: currentAppointment.appointmentDate,
      status: currentAppointment.status,
      description: currentAppointment.description,
    };

    try {
      await axios.post('http://localhost:5281/api/appointment', newAppointmentData);

      await axios.delete(`http://localhost:5281/api/ExtendedAppointment/${currentAppointment.appointmentID}`);

      message.success('Cita convertida a Cita del Día correctamente');
      setShowDayAppointmentModal(false);
      router.push('/citas-agendadas');
    } catch (error) {
      message.error('Error al convertir la cita');
    }
  };

  return (
    <>
    <h1 style={{ fontSize: '24px', marginBottom: '24px', color: '#1890ff' }}>Agendar y Gestionar Citas</h1>
      <AntCalendar cellRender={dateCellRender} onSelect={handleDateClick} />
      <Modal
        title="Cita del Día"
        open={showDayAppointmentModal}
        onCancel={() => setShowDayAppointmentModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowDayAppointmentModal(false)}>
            Cancelar
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConvertToDailyAppointment}>
            Convertir a Cita del Día
          </Button>,
        ]}
      >
        {currentAppointment && (
          <div>
            <p><strong>Nombre:</strong> {currentAppointment.name}</p>
            <p><strong>Fecha de Nacimiento:</strong> {currentAppointment.birthDate}</p>
            <p><strong>Servicio:</strong> {currentAppointment.serviceType}</p>
            <p><strong>Descripción:</strong> {currentAppointment.description}</p>
            <p><strong>Horario:</strong> {schedules.find((s) => s.id === currentAppointment.scheduleID)?.time}</p>
          </div>
        )}
      </Modal>
      <Modal
        title="¿Estás seguro de que deseas cancelar esta cita?"
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowCancelModal(false)}>
            No
          </Button>,
          <Button key="submit" type="primary" onClick={confirmDelete}>
            Sí
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Motivo de la cancelación">
            <Input.TextArea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              required
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Formulario de Cita"
        open={showForm}
        onCancel={() => setShowForm(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Fecha de Nacimiento" name="birthDate" rules={[{ required: true, message: 'Por favor selecciona tu fecha de nacimiento' }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Servicio" name="serviceType" rules={[{ required: true, message: 'Por favor selecciona un servicio' }]}>
            <Select options={serviceTypes} />
          </Form.Item>
          <Form.Item label="Descripción" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Horario" name="scheduleID" rules={[{ required: true, message: 'Por favor selecciona un horario' }]}>
            <Select options={schedules.map((schedule) => ({ value: schedule.id, label: schedule.time }))} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {formData.appointmentID ? 'Actualizar' : 'Agendar'}
          </Button>
          {formData.appointmentID > 0 && (
              <Button
                type='danger'
                style={{ marginLeft: '8px' }}
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            )}
        </Form>
      </Modal>
    </>
  );
};

export default ExtendedAppointment;
