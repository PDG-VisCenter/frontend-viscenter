'use client';

import { Button, Col, Flex, Form, Input, InputNumber, Layout, Row, Select, theme, Upload } from 'antd';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import { PlusOutlined } from '@ant-design/icons';
import SiderMenuSeller from '../components/SiderMenuSeller';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/typography/Title';

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

function AddProduct() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='2' />
        <Content
          style={{
            margin: '8px 10%',
            overflow: 'auto',
            height: '100vh',
          }}
        >
          <div
            style={{
              padding: 32,
              height: '100%',
              width: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: 'auto',
            }}
          >
            <Title level={3}>Crear un Nuevo Producto</Title>
            <Form
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              layout='vertical'
            >
              <Form.Item
                label='Nombre'
                required
              >
                <Input size='large' />
              </Form.Item>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label='Precio'>
                    <InputNumber
                      style={{ width: '100%' }}
                      size='large'
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='Stock'>
                    <InputNumber
                      style={{ width: '100%' }}
                      size='large'
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='SKU'>
                    <InputNumber
                      style={{ width: '100%' }}
                      size='large'
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='category'
                    label='Categoria'
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, elige una categoria',
                      },
                    ]}
                  >
                    <Select
                      placeholder='Elige una categoria'
                      size='large'
                      options={[
                        {
                          value: 'glasses',
                          label: 'Lentes',
                        },
                        {
                          value: 'sunglasses',
                          label: 'Lentes de sol',
                        },
                        {
                          value: 'accessories',
                          label: 'Accesorios',
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='brand'
                    label='Marca'
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, elige una marca',
                      },
                    ]}
                  >
                    <Select
                      placeholder='Elige una marca'
                      size='large'
                      options={[
                        {
                          value: 'ch',
                          label: 'Carolina Herrera',
                        },
                        {
                          value: 'carrera',
                          label: 'Carrera',
                        },
                        {
                          value: 'gucci',
                          label: 'Gucci',
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name='shape'
                    label='Forma'
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, elige una forma',
                      },
                    ]}
                  >
                    <Select
                      placeholder='Elige una forma'
                      size='large'
                      options={[
                        {
                          value: 'ch',
                          label: 'Carolina Herrera',
                        },
                        {
                          value: 'carrera',
                          label: 'Carrera',
                        },
                        {
                          value: 'gucci',
                          label: 'Gucci',
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='material'
                    label='Material'
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, elige un material',
                      },
                    ]}
                  >
                    <Select
                      placeholder='Elige un material'
                      size='large'
                      options={[
                        {
                          value: 'ch',
                          label: 'Carolina Herrera',
                        },
                        {
                          value: 'carrera',
                          label: 'Carrera',
                        },
                        {
                          value: 'gucci',
                          label: 'Gucci',
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name='color'
                    label='Color'
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, elige un color',
                      },
                    ]}
                  >
                    <Select
                      placeholder='Elige un color'
                      size='large'
                      options={[
                        {
                          value: 'ch',
                          label: 'Carolina Herrera',
                        },
                        {
                          value: 'carrera',
                          label: 'Carrera',
                        },
                        {
                          value: 'gucci',
                          label: 'Gucci',
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label='Descripcion'>
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label='Imagenes'
                valuePropName='fileList'
                getValueFromEvent={normFile}
              >
                <Upload
                  action='/upload.do'
                  listType='picture-card'
                >
                  <button
                    style={{ border: 0, background: 'none' }}
                    type='button'
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Subir</div>
                  </button>
                </Upload>
              </Form.Item>
              <Flex
                justify='space-between'
                align='center'
              >
                <Button
                  type='primary'
                  size='large'
                  danger
                >
                  Cancelar
                </Button>
                <Button
                  type='primary'
                  size='large'
                >
                  Guardar
                </Button>
              </Flex>
            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AddProduct;
