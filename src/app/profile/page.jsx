'use client';

import { Avatar, Button, DatePicker, Layout, Menu, Modal, Table } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import Title from 'antd/es/typography/Title';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Footer from '../../components/Footer';
import HeaderSimple from '../../components/HeaderSimple';
import { keycloakSessionLogOut } from '@/components/authStatus';
import { fetchUserAccessToken } from '@/app/services/keycloakServices';

const items = [
  { key: 'account', label: 'Cuenta' },
  { key: 'orders', label: 'Pedidos' },
  { key: 'appointments', label: 'Historial de Citas' },
];

const siderStyle = {
  lineHeight: '120px',
};

const contentStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  minHeight: '80vh',
};

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('account');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session || !session.userId) {
      return;
    }

    fetchAppointmentHistory();
  }, [session, status]);

  const fetchAppointmentHistory = async () => {
    const token = await fetchUserAccessToken();
    console.log(token);

    try {
      if (session?.roles.includes('client_role')) {
        axios
          .get(`http://localhost:5270/viscenter/api/v1/History/user/${session.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setAppointments(response.data);
            setFilteredAppointments(response.data);
          })
          .catch((error) => console.error('Error fetching appointments:', error));
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const showModal = () => setIsModalOpen(true);

  const handleLogout = () => {
    setIsModalOpen(false);
    keycloakSessionLogOut().then(() => signOut({ callbackUrl: '/' }));
  };

  const handleCancel = () => setIsModalOpen(false);

  const handleMenuClick = (e) => setSelectedMenu(e.key);

  const handleDateChange = (date) => {
    setSelectedDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
    const filtered = date
      ? appointments.filter((appointment) => dayjs(appointment.appointmentDate).isSame(dayjs(date), 'day'))
      : appointments;
    setFilteredAppointments(filtered);
  };

  const columns = [
    { title: 'Nombre del Paciente', dataIndex: 'patientName', key: 'patientName' },
    { title: 'Fecha', dataIndex: 'appointmentDate', render: (date) => dayjs(date).format('YYYY-MM-DD') },
    { title: 'Servicio', dataIndex: 'serviceType', key: 'serviceType' },
    { title: 'Doctor/Doctora', dataIndex: 'doctorName', key: 'doctorName' },
    { title: 'Estado', dataIndex: 'status', key: 'status' },
  ];

  return (
    <Layout>
      <HeaderSimple />
      <Layout>
        <Sider
          width='17%'
          style={siderStyle}
        >
          <Menu
            onClick={handleMenuClick}
            style={{ height: '100%', flex: 'auto' }}
            defaultSelectedKeys={['account']}
            mode='inline'
            items={items}
          />
        </Sider>

        <Content style={contentStyle}>
          {selectedMenu === 'account' && (
            <div>
              <Title>Mi cuenta</Title>
              <Avatar
                size={120}
                icon={<UserOutlined />}
              />
              <p>Nombre: {session?.user?.name}</p>
              <p>Email: {session?.user?.email}</p>
              <Button
                type='primary'
                onClick={showModal}
              >
                Cerrar sesión
              </Button>
              <Modal
                title='Cerrar sesión'
                open={isModalOpen}
                onOk={handleLogout}
                onCancel={handleCancel}
              >
                <p>¿Estás seguro de que quieres cerrar sesión?</p>
              </Modal>
            </div>
          )}

          {selectedMenu === 'orders' && (
            <div>
              <Title>Historial de pedidos</Title>
              <p>Aún no has realizado ningún pedido</p>
            </div>
          )}

          {selectedMenu === 'appointments' && (
            <div style={{ width: '100%', padding: '20px' }}>
              <Title level={2}>Historial de citas</Title>
              {session?.roles.includes('client_role') ? (
                <>
                  <DatePicker
                    onChange={handleDateChange}
                    style={{ marginBottom: 20 }}
                  />
                  <Table
                    columns={columns}
                    dataSource={filteredAppointments}
                    rowKey='historyID'
                    pagination={{ pageSize: 5 }}
                  />
                  {!filteredAppointments.length && <p>No se han agendado citas.</p>}
                </>
              ) : (
                <p>Eres el administrador.</p>
              )}
            </div>
          )}
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default Profile;
