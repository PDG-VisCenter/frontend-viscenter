import { Button, Col, Divider, Form, Image, Input, InputNumber, Row, Select, Space, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { colors } from '@/data/searchFilters';
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

function ProductVariants() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

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

  return (
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
  );
}

export default ProductVariants;
