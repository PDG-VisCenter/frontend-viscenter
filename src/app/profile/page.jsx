'use client';

import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function Profile() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
    </>
  );
}

export default Profile;
