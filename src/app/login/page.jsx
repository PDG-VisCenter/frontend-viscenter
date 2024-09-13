'use client';

import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import Link from 'next/link';
import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    console.log('submit');
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
