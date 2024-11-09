'use client';

import { brands, categoriesAndSubcategories, colors, materials, shapes } from '@/data/searchFilters';
import {
  Button,
  Cascader,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Layout,
  message,
  Row,
  Select,
  Space,
  Steps,
  theme,
  Upload,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import SiderMenuSeller from '../components/SiderMenuSeller';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/typography/Title';
import { useState } from 'react';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

function AddProduct() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const { token } = theme.useToken();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const contentStyle = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 24,
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleImagePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeImage = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  const steps = [
    {
      title: 'Información del Producto',
      render: () => (
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout='vertical'
          style={{
            paddingTop: 25,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          <Form.Item
            label='Nombre'
            required
          >
            <Input size='large' />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Precio'
                required
              >
                <InputNumber
                  addonAfter='Bs'
                  size='large'
                  style={{ width: '100%' }}
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
                  options={brands}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='category'
                label='Categoria y Subcategoria'
                rules={[
                  {
                    required: true,
                    message: 'Por favor, elige una categoria',
                  },
                ]}
              >
                <Cascader
                  placeholder='Elige una categoria y subcategoria'
                  size='large'
                  options={categoriesAndSubcategories}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='shape'
                label='Forma'
                rules={[
                  {
                    message: 'Por favor, elige una forma',
                  },
                ]}
              >
                <Select
                  placeholder='Elige una forma'
                  size='large'
                  options={shapes}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  options={materials}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label='Descripcion'>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Variantes del Producto',
      render: () => (
        <>
          <Form
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout='vertical'
            style={{
              paddingTop: 25,
              paddingLeft: 40,
              paddingRight: 40,
            }}
          >
            <Divider
              style={{
                borderColor: '#000000',
              }}
            >
              Item 1
            </Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label='Stock'
                  required
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    size='large'
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label='Código del Producto'
                  required
                >
                  <Input
                    style={{ width: '100%' }}
                    size='large'
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name='color'
                  label='Colores'
                >
                  <Select
                    placeholder='Elige un color'
                    size='large'
                    options={colors}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label='Imagenes'
              valuePropName='fileList'
              getValueFromEvent={normFile}
            >
              <Upload
                listType='picture-card'
                fileList={fileList}
                onPreview={handleImagePreview}
                onChange={handleChangeImage}
              >
                <button
                  style={{ border: 0, background: 'none' }}
                  type='button'
                >
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Subir</div>
                </button>
              </Upload>
              {previewImage && (
                <Image
                  alt=''
                  wrapperStyle={{
                    display: 'none',
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                />
              )}
            </Form.Item>
          </Form>
          <Form
            name='dynamic_form_nest_item'
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout='vertical'
            onFinish={onFinish}
            autoComplete='off'
          >
            <Form.List name='users'>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      direction='vertical'
                      style={{
                        display: 'flex',
                        paddingLeft: 40,
                        paddingRight: 40,
                        marginBottom: 10,
                      }}
                    >
                      <Divider
                        style={{
                          borderColor: '#000000',
                        }}
                      >
                        Item {key + 2}
                      </Divider>
                      <Button
                        type='dashed'
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                        style={{
                          marginBottom: 15,
                        }}
                        danger
                        block
                      >
                        Eliminar item
                      </Button>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            label='Stock'
                            required
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              size='large'
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            label='Código del Producto'
                            required
                          >
                            <Input
                              style={{ width: '100%' }}
                              size='large'
                            />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name='color'
                            label='Colores'
                          >
                            <Select
                              placeholder='Elige un color'
                              size='large'
                              options={colors}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Form.Item
                        {...restField}
                        label='Imagenes'
                        valuePropName='fileList'
                        getValueFromEvent={normFile}
                      >
                        <Upload
                          listType='picture-card'
                          fileList={fileList}
                          onPreview={handleImagePreview}
                          onChange={handleChangeImage}
                        >
                          <button
                            style={{ border: 0, background: 'none' }}
                            type='button'
                          >
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Subir</div>
                          </button>
                        </Upload>
                        {previewImage && (
                          <Image
                            alt=''
                            wrapperStyle={{
                              display: 'none',
                            }}
                            preview={{
                              visible: previewOpen,
                              onVisibleChange: (visible) => setPreviewOpen(visible),
                              afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                          />
                        )}
                      </Form.Item>
                    </Space>
                  ))}
                  <Form.Item
                    style={{
                      paddingTop: 25,
                      paddingLeft: 40,
                      paddingRight: 40,
                    }}
                  >
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      block
                    >
                      Añadir item
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </>
      ),
    },
    {
      title: 'Revisión',
      render: () => (
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
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='2' />
        <Content
          style={{
            margin: '8px 16px',
            overflow: 'auto',
            height: '88vh',
          }}
        >
          <div
            style={{
              padding: 32,
              minHeight: '88vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: 'auto',
            }}
          >
            <Title level={3}>Crear Producto</Title>
            <Steps
              current={currentStep}
              items={items}
            />
            <div style={contentStyle}>{steps[currentStep].render()}</div>
            <Flex
              justify='space-between'
              align='center'
              style={{
                marginTop: 20,
              }}
            >
              {currentStep > 0 && (
                <Button
                  size='large'
                  onClick={() => prevStep()}
                >
                  Anterior
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  type='primary'
                  size='large'
                  onClick={() => nextStep()}
                  style={{ marginLeft: 'auto' }}
                >
                  Siguiente
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <div
                  style={{
                    width: '200px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
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
                    onClick={() => message.success('Processing complete!')}
                  >
                    Guardar
                  </Button>
                </div>
              )}
            </Flex>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AddProduct;
