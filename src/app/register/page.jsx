'use client';

import { Alert, Button, Form, Input } from 'antd';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function Register() {
  const route = useRouter();
  const [form] = Form.useForm();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);

    try {
      const adminTokenResponse = await axios.post(
        'http://localhost:8181/realms/paws-and-claws-realm/protocol/openid-connect/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: 'paws-claws-client',
          client_secret: 'MgqEo5QeQKFndVAoSVHw3dCPpoapWlBp',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const adminToken = adminTokenResponse.data.access_token;

      localStorage.setItem('token', adminToken);

      const createUserResponse = await axios.post(
        'http://localhost:8181/admin/realms/paws-and-claws-realm/users',
        {
          username: username,
          firstName: firstName,
          lastName: lastName,
          enabled: true,
          credentials: [
            {
              temporary: false,
              type: 'password',
              value: password,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (createUserResponse.status === 201) {
        const usersResponse = await axios.get('http://localhost:8181/admin/realms/paws-and-claws-realm/users', {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        const newUser = usersResponse.data.find((user) => user.username === username);
        if (newUser) {
          const userId = newUser.id;
          const roleData = [
            {
              id: '5fc9ef33-f6c5-4da2-adae-56d4caf0f804',
              name: 'client_role',
              composite: false,
              clientRole: true,
              containerId: '8223ed18-c01e-4430-9dd6-54b8ac13a1ca',
            },
          ];

          await axios.post(
            `http://localhost:8181/admin/realms/paws-and-claws-realm/users/${userId}/role-mappings/clients/8223ed18-c01e-4430-9dd6-54b8ac13a1ca`,
            roleData,
            {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            }
          );

          route.push('/login');
        }
      }
    } catch (error) {
      console.error('Error creating account:', error);
      <Alert
        message='Error Creating Account'
        description='Error creating account, please review your internet connection'
        type='error'
        closable
      />;
    }
  };

  return (
    <div className='background-register'>
      <div className='register'>
        <h1 className='register__title'>VisCenter</h1>
        <h2 className='register__subtitle'>Crear cuenta</h2>
        <Form
          layout='vertical'
          form={form}
          name='register'
          onFinish={onFinish}
          className='register__form'
          scrollToFirstError
        >
          <Form.Item
            name='username'
            label='Nombre de usuario'
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu usuario',
                whitespace: true,
              },
              {
                min: 5,
                message: 'El nombre de usuario debe tener al menos 5 caracteres',
              },
            ]}
          >
            <Input
              placeholder='Nombre de usuario'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <div className='register__userinfo'>
            <Form.Item
              name='name'
              label='Nombre'
              rules={[
                {
                  required: true,
                  message: 'El nombre es obligatorio',
                },
              ]}
            >
              <Input
                placeholder='Nombre'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Item>
            &nbsp;&nbsp;&nbsp;
            <Form.Item
              name='lastname'
              label='Apellido'
              rules={[
                {
                  required: true,
                  message: 'El apellido es obligatorio',
                },
              ]}
            >
              <Input
                placeholder='Apellido'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Item>
          </div>

          <Form.Item
            name='password'
            label='Contraseña'
            rules={[
              {
                required: true,
                message: 'Por favor ingresa una contraseña',
              },
              {
                min: 5,
                message: 'La contraseña debe tener al menos 5 caracteres',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name='confirm'
            label='Confirma la contraseña'
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Por favor confirma tu contraseña',
              },
              {
                min: 5,
                message: 'La contraseña debe tener al menos 5 caracteres',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              type='primary'
              htmlType='submit'
            >
              Register
            </Button>
          </Form.Item>
          <div className='register__login'>
            <p>¿Ya tienes una cuenta?&nbsp;</p>
            <Link href='/login'>Ingresa</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
