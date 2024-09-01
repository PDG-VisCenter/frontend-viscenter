'use client';

import { Button, Form, Input } from 'antd';
import Link from 'next/link';

function Register() {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
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
            ]}
          >
            <Input />
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
              <Input />
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
              <Input />
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
            ]}
            hasFeedback
          >
            <Input.Password />
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
            <Input.Password />
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
