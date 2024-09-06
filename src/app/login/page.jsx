'use client';

import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorP, setErrorP] = useState('');

  const handleSubmit = async () => {
    const data = new URLSearchParams({
      grant_type: 'password',
      client_id: 'paws-claws-client',
      username: username,
      password: password,
      client_secret: 'MgqEo5QeQKFndVAoSVHw3dCPpoapWlBp',
    });

    try {
      const response = await axios.post(
        'http://localhost:8181/realms/paws-and-claws-realm/protocol/openid-connect/token',
        data
      );
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      router.push('/');
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorP('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className='background-login'>
      <div className='login'>
        <h1 className='login__title'>VisCenter</h1>
        <h2 className='login__subtitle'>Iniciar sesión</h2>
        <Form
          name='login'
          layout='vertical'
          initialValues={{
            remember: true,
          }}
          className='login__form'
          size='large'
          onFinish={handleSubmit}
        >
          {errorP && <div className=''>{errorP}</div>}
          <Form.Item
            name='username'
            label='Usuario'
            rules={[
              {
                required: true,
                message: 'Este campo no puede estar vacío',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name='password'
            label='Password'
            rules={[
              {
                required: true,
                message: 'Este campo no puede estar vacío',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type='password'
              placeholder='Contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type='primary'
              htmlType='submit'
              color='#ffc038'
            >
              Ingresar
            </Button>
            <div className='login__register'>
              <p>¿No tienes una cuenta?&nbsp;</p>
              <Link href='/register'>Registrate</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
