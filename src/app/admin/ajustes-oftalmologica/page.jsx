'use client';

import React, { useEffect, useState } from 'react';
import { Layout, theme, message, Form, Input, Button, TimePicker, Select, List, Switch, Modal } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import axios from 'axios';
import moment from 'moment';
import UpdateMap from '@/app/components/UpdateMap';

const { Option } = Select;

function Appointments() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [availabilities, setAvailabilities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [services, setServices] = useState([]);
  const [newServiceType, setNewServiceType] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [editingDoctor, setEditingDoctor] = useState(null);

  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = useState(location);

  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
  const [isDoctorModalVisible, setIsDoctorModalVisible] = useState(false);

  useEffect(() => {
    fetchLocation();
    fetchAvailabilities();
    fetchAppointments();
    fetchServices();
    fetchDoctors();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const { data } = await axios.get('http://localhost:5281/api/Availability');
      setAvailabilities(data);
    } catch (error) {
      message.error('Error obteniendo disponibilidades.');
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5281/api/Appointment');

      if (data && data.length > 0) {
        setAppointments(data);
      } else {
        message.info('No se encontraron citas del día.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No appointments endpoint found (404).');
      } else {
        console.error('Error fetching appointments:', error);
      }
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await axios.get('http://localhost:5281/api/AppointmentService');
      setServices(data);
    } catch (error) {
      message.error('Error obteniendo los servicios.');
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('http://localhost:5281/api/Doctor');
      setDoctors(data);
    } catch (error) {
      message.error('Error obteniendo los doctores.');
    }
  };

  const hasAppointments = (availabilityID) => {
    return appointments.some((appt) => appt.availabilityID === availabilityID);
  };

  const fetchLocation = async () => {
    try {
      const { data } = await axios.get('http://localhost:5281/api/LocationCenter');
      const location = data[0];
      setLocation({ lat: location.latitude, lng: location.longitude });
      setMarkerPosition({ lat: location.latitude, lng: location.longitude });
    } catch (error) {
      message.error('Error obteniendo la localización del centro.');
    }
  };

  const handleUpdateLocation = async () => {
    try {
      await axios.put('http://localhost:5281/api/LocationCenter', {
        locationID: 1,
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
      });
      message.success('Localización actualizada con éxito.');
    } catch (error) {
      message.error('Error al actualizar la localización.');
    }
  };

  const onMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition({ lat, lng });
  };

  const handleUpdateAvailability = async () => {
    if (!selectedAvailability || !startTime || !endTime) {
      message.warning('Por favor selecciona una disponibilidad y horarios.');
      return;
    }

    const now = moment();
    if (moment(selectedAvailability.startTime, 'HH:mm:ss').isBefore(now)) {
      message.error('No es posible actualizar un horario pasado.');
      return;
    }

    try {
      await axios.put(`http://localhost:5281/api/Availability`, {
        availabilityID: selectedAvailability.availabilityID,
        startTime: startTime.format('HH:mm:ss'),
        endTime: endTime.format('HH:mm:ss'),
        isAvailable: selectedAvailability.isAvailable,
        date: new Date().toISOString(),
      });
      message.success('Disponibilidad actualizada exitosamente.');
      fetchAvailabilities();
    } catch (error) {
      message.error('Error actualizando disponibilidad.');
    }
  };

  const handleToggleAvailability = async (availability) => {
    const now = moment();
    if (moment(availability.startTime, 'HH:mm:ss').isBefore(now)) {
      message.warning('No es posible actualizar horarios para horarios pasados.');
      return;
    }

    if (!availability.isAvailable && hasAppointments(availability.availabilityID)) {
      message.error('No es posible actualizar este horario a disponible, existe una cita asociada a este horario.');
      return;
    }

    try {
      await axios.patch(`http://localhost:5281/api/Availability/${availability.availabilityID}`, {
        isAvailable: !availability.isAvailable,
      });
      message.success('Estado de la disponibilidad actualizado exitosamente.');
      fetchAvailabilities();
    } catch (error) {
      message.error('Error actualizando el estado de la disponibilidad.');
    }
  };

  const handleAddService = async () => {
    if (!newServiceType) {
      message.warning('Por favor ingresa un tipo de servicio.');
      return;
    }

    try {
      await axios.post('http://localhost:5281/api/AppointmentService', {
        serviceType: newServiceType,
      });
      message.success('Servicio agregado exitosamente.');
      setNewServiceType('');
      fetchServices();
    } catch (error) {
      message.error('Error añadiendo el servicio.');
    }
  };

  const handleAddDoctor = async () => {
    if (!newDoctor) {
      message.warning('Por favor selecciona a un doctor o doctora.');
      return;
    }

    try {
      await axios.post('http://localhost:5281/api/Doctor', {
        doctorName: newDoctor,
      });
      message.success('Doctor Doctora agregado Correctamente.');
      setNewDoctor('');
      fetchDoctors();
    } catch (error) {
      message.error('Error añadiendo al Doctor Doctora.');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsServiceModalVisible(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setIsDoctorModalVisible(true);
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    try {
      await axios.put('http://localhost:5281/api/AppointmentService', {
        serviceID: editingService.serviceID,
        serviceType: editingService.serviceType,
      });
      message.success('Servicio actualizado exitosamente.');
      setIsModalVisible(false);
      fetchServices();
    } catch (error) {
      message.error('Error actualizando el servicio.');
    }
  };

  const handleUpdateDoctor = async () => {
    if (!editingDoctor) return;

    try {
      await axios.put('http://localhost:5281/api/Doctor', {
        doctorID: editingDoctor.doctorID,
        doctorName: editingDoctor.doctorName,
      });
      message.success('Se actualizó correctamente.');
      setIsModalVisible(false);
      fetchDoctors();
    } catch (error) {
      message.error('Error actualizando.');
    }
  };

  const handleDeleteService = async (serviceID) => {
    try {
      await axios.delete(`http://localhost:5281/api/AppointmentService/${serviceID}`);
      message.success('Servicio eliminado correctamente.');
      fetchServices();
    } catch (error) {
      message.error('Error eliminando el servicio.');
    }
  };

  const handleDeleteDoctor = async (doctorID) => {
    try {
      await axios.delete(`http://localhost:5281/api/Doctor/${doctorID}`);
      message.success('Eliminado correctamente.');
      fetchDoctors();
    } catch (error) {
      message.error('Error eliminando.');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='9' />
        <Content style={{ margin: '8px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <h2 style={{ marginBottom: 8, fontWeight: 'bold', fontSize: '24px' }}>
              Configurar los horarios del centro
            </h2>
            <h2 style={{ marginTop: 8, marginBottom: 8, fontSize: '16px' }}>
              Debes estar dentro del rango de horarios para poder actualizarlos, al actualizar un horario todos sus
              adyacentes se actualizaran también.
            </h2>
            <Select
              style={{ width: '100%' }}
              placeholder='Seleccione un horario para actualizar'
              onChange={(id) => setSelectedAvailability(availabilities.find((a) => a.availabilityID === id))}
            >
              {availabilities.map((slot) => (
                <Option
                  key={slot.availabilityID}
                  value={slot.availabilityID}
                >
                  {`${slot.startTime} - ${slot.endTime}`}
                </Option>
              ))}
            </Select>

            <TimePicker.RangePicker
              style={{ width: '100%', marginTop: 16 }}
              format='HH:mm'
              onChange={(times) => {
                setStartTime(times[0]);
                setEndTime(times[1]);
              }}
            />
            <Button
              type='primary'
              block
              style={{ marginTop: 16 }}
              onClick={handleUpdateAvailability}
            >
              Actualizar Disponibilidad
            </Button>

            <h2 style={{ marginTop: 16, fontWeight: 'bold', fontSize: '24px' }}>Disponibilidad del Día de Hoy</h2>
            <List
              dataSource={availabilities}
              renderItem={(availability) => (
                <List.Item>
                  <div>{`${availability.startTime} - ${availability.endTime}`}</div>
                  <Switch
                    checked={availability.isAvailable}
                    onChange={() => handleToggleAvailability(availability)}
                    disabled={
                      moment(availability.startTime, 'HH:mm:ss').isBefore(moment()) ||
                      hasAppointments(availability.availabilityID)
                    }
                  />
                </List.Item>
              )}
            />

            <h2 style={{ marginTop: 16, fontWeight: 'bold', fontSize: '24px' }}>Servicios del Centro</h2>
            <List
              dataSource={services}
              renderItem={(service) => (
                <List.Item
                  actions={[
                    <Button onClick={() => handleEditService(service)}>Editar</Button>,
                    <Button
                      danger
                      onClick={() => handleDeleteService(service.serviceID)}
                    >
                      Eliminar
                    </Button>,
                  ]}
                >
                  {service.serviceType}
                </List.Item>
              )}
            />

            <Input
              placeholder='Nuevo tipo de servicio'
              value={newServiceType}
              onChange={(e) => setNewServiceType(e.target.value)}
              style={{ marginTop: 16 }}
            />
            <Button
              type='primary'
              block
              style={{ marginTop: 8 }}
              onClick={handleAddService}
            >
              Añadir Servicio
            </Button>

            <h2 style={{ marginTop: 16, fontWeight: 'bold', fontSize: '24px' }}>Doctores Doctoras del Centro</h2>
            <List
              dataSource={doctors}
              renderItem={(doctor) => (
                <List.Item
                  actions={[
                    <Button onClick={() => handleEditDoctor(doctor)}>Editar</Button>,
                    <Button
                      danger
                      onClick={() => handleDeleteDoctor(doctor.doctorID)}
                    >
                      Eliminar
                    </Button>,
                  ]}
                >
                  {doctor.doctorName}
                </List.Item>
              )}
            />

            <Input
              placeholder='Nuevo Doctor Doctora'
              value={newDoctor}
              onChange={(e) => setNewDoctor(e.target.value)}
              style={{ marginTop: 16 }}
            />
            <Button
              type='primary'
              block
              style={{ marginTop: 8 }}
              onClick={handleAddDoctor}
            >
              Añadir Doctor Doctora
            </Button>

            <Modal
              title='Editar Servicio'
              open={isServiceModalVisible}
              onOk={handleUpdateService}
              onCancel={() => setIsServiceModalVisible(false)}
            >
              <Input
                value={editingService?.serviceType}
                onChange={(e) => setEditingService({ ...editingService, serviceType: e.target.value })}
              />
            </Modal>

            <Modal
              title='Editar Doctor'
              open={isDoctorModalVisible}
              onOk={handleUpdateDoctor}
              onCancel={() => setIsDoctorModalVisible(false)}
            >
              <Input
                value={editingDoctor?.doctorName}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, doctorName: e.target.value })}
              />
            </Modal>

            <h2 style={{ marginTop: 16, fontWeight: 'bold', fontSize: '24px' }}>Actualizar Ubicación del Centro</h2>
            <h2 style={{ marginTop: 8, marginBottom: 8, fontSize: '16px' }}>
              Localiza una nueva ubicación en el mapa y selecciónala con doble click
            </h2>

            {location.lat !== 0 && location.lng !== 0 && (
              <UpdateMap
                center={markerPosition}
                zoom={16}
                markerPosition={markerPosition}
                setMarkerPosition={setMarkerPosition}
              />
            )}
            <p style={{ marginTop: 8 }}>
              Latitud: {markerPosition.lat.toFixed(6)}, Longitud: {markerPosition.lng.toFixed(6)}
            </p>
            <Button
              type='primary'
              block
              style={{ marginTop: 16 }}
              onClick={handleUpdateLocation}
            >
              Actualizar Localización
            </Button>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Appointments;
