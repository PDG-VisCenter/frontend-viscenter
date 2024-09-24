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

const ExtendedAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    appointmentID: 0,
    userID: 1,
    appointmentDate: '',
    status: 'Scheduled',
    description: '',
    scheduleID: schedules[0].id,
    name: '',
    birthDate: '',
  });

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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5281/api/ExtendedAppointment/${formData.appointmentID}`);
      fetchAppointments();
      message.success('Cita eliminada correctamente');
      setShowForm(false);
    } catch (error) {
      message.error('Error eliminando la cita');
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

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '24px', color: '#1890ff' }}>Agendar y Gestionar Citas</h1>
      <AntCalendar
        fullscreen
        onSelect={handleDateClick}
        dateCellRender={dateCellRender}
        onPanelChange={fetchAppointments}
      />

      <Modal
        title={formData.appointmentID ? 'Editar Cita' : 'Agendar Cita'}
        open={showForm}
        onCancel={() => setShowForm(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={formData}>
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="birthDate"
            label="Fecha de Nacimiento"
            rules={[{ required: true, message: 'Por favor ingrese su fecha de nacimiento' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="description" label="Descripción">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="scheduleID"
            label="Horario"
            rules={[{ required: true, message: 'Por favor seleccione un horario' }]}
          >
            <Select>
              {schedules.map((schedule) => (
                <Select.Option key={schedule.id} value={schedule.id}>
                  {schedule.time}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {formData.appointmentID ? 'Actualizar' : 'Agendar'}
            </Button>
            {formData.appointmentID > 0 && (
              <Button danger style={{ marginLeft: '8px' }} onClick={handleDelete}>
                Eliminar
              </Button>
            )}
            <Button style={{ marginLeft: '8px' }} onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExtendedAppointment;
