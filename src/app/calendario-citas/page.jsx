'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import moment from 'moment';
import { Calendar as AntCalendar, Modal, Form, Input, DatePicker, Select, Button, message, ConfigProvider } from 'antd';

const ExtendedAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [doctors, setDoctors] = useState([]);
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
    scheduleID: schedules.id,
    serviceType: '',
    patientName: '',
    patientBirthday: '',
    symptoms: '',
    doctorName: '',
  });
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAppointments();
    fetchServiceTypes();
    fetchDoctors();
    axios.get('http://localhost:5281/api/ExtendedAppointment/schedules')
      .then(response => {
        const schedulesData = response.data.map(schedule => ({
          id: schedule.scheduleID,
          time: `${schedule.startTime} - ${schedule.endTime}`,
        }));
        setSchedules(schedulesData);
      })
      .catch(error => console.error('Error fetching schedules:', error));
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

  const fetchServiceTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5281/api/AppointmentService');
      const formattedServices = response.data.map(service => ({
        value: service.serviceType,
        label: service.serviceType,
      }));
      setServiceTypes(formattedServices);
    } catch (error) {
      message.error('Error al obtener los tipos de servicio');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5281/api/Doctor');
      const formattedDoctors = response.data.map(doctor => ({
        value: doctor.doctorName,
        label: doctor.doctorName,
      }));
      setDoctors(formattedDoctors);
    } catch (error) {
      message.error('Error al obtener los doctores');
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
        patientName: '',
        patientBirthday: '',
        symptoms: '',
        doctorName: '',
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
      patientName: event.patientName,
      patientBirthday: event.patientBirthday,
      symptoms: event.symptoms,
      doctorName: event.doctorName,
    });
    setShowForm(true);
    form.setFieldsValue({
      ...event,
      patientBirthday: moment(event.patientBirthday),
    });
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
      patientName: currentAppointment.patientName,
      patientBirthday: currentAppointment.patientBirthday,
      symptoms: currentAppointment.symptoms,
      serviceType: currentAppointment.serviceType,
      doctorName: currentAppointment.doctorName,
    };

    try {
      await axios.post('http://localhost:5281/api/appointment', newAppointmentData);

      await axios.delete(`http://localhost:5281/api/ExtendedAppointment/${currentAppointment.appointmentID}`);

      await axios.patch(`http://localhost:5281/api/Availability/${currentAppointment.scheduleID}`, {
        isAvailable: false,
      });

      message.success('Cita convertida a Cita del Día correctamente');
      setShowDayAppointmentModal(false);
      router.push('/citas-agendadas');
    } catch (error) {
      message.error('Error al convertir la cita, excedió el plazo límite');
      await axios.delete(`http://localhost:5281/api/ExtendedAppointment/${currentAppointment.appointmentID}`);
    }
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
    <div style={{backgroundColor: '#f0f2f5', padding:'5px'}}>
    <h1 style={{ fontSize: '24px', marginBottom: '24px', color: '#fe0034' }}>Agendar y Gestionar Citas</h1>
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
            <p><strong>Nombre:</strong> {currentAppointment.patientName}</p>
            <p><strong>Fecha de Nacimiento:</strong> {currentAppointment.patientBirthday}</p>
            <p><strong>Servicio:</strong> {currentAppointment.serviceType}</p>
            <p><strong>Doctor Doctora:</strong> {currentAppointment.doctorName}</p>
            <p><strong>Síntomas:</strong> {currentAppointment.symptoms}</p>
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
          <Form.Item label="Nombre" name="patientName" rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Fecha de Nacimiento" name="patientBirthday" rules={[{ required: true, message: 'Por favor selecciona tu fecha de nacimiento' }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Servicio" name="serviceType" rules={[{ required: true, message: 'Por favor selecciona un servicio' }]}>
            <Select options={serviceTypes} />
          </Form.Item>
          <Form.Item label="Doctor Doctora" name="doctorName" rules={[{ required: true, message: 'Por favor selecciona un Doctor o Doctora' }]}>
            <Select options={doctors} />
          </Form.Item>
          <Form.Item label="Síntomas" name="symptoms">
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
    </div>
    </ConfigProvider>
  );
};

export default ExtendedAppointment;
