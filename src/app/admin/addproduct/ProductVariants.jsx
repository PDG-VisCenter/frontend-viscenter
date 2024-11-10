import { Button, Col, Divider, Form, Image, Input, InputNumber, Row, Select, Space, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '@/data/searchFilters';
import { addProductItem, deleteProductItem, setProductItem } from '@/lib/features/addProductItemSlice';
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
  const dispatch = useDispatch();
  const productItemData = useSelector((state) => state.addProductItem);
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

  const handleChangeImage = (index, { fileList: newFileList }) => {
    setFileList(newFileList);
    const images = newFileList.map(file => file.originFileObj);
    dispatch(
      setProductItem({
        index,
        item: {
          images: images,
        }
      })
    );
    //console.log(fileList);
  };

  const handleStockChange = (index, value) => {
    dispatch(
      setProductItem({
        index,
        item: {
          stock: value,
        },
      })
    );
  };

  const handleProductCodeChange = (index, event) => {
    dispatch(
      setProductItem({
        index,
        item: {
          productCode: event.target.value,
        },
      })
    );
  };

  const handleColorChange = (index, value) => {
    dispatch(
      setProductItem({
        index,
        item: {
          color: value,
        },
      })
    );
  };

  const removeItem = (remove, name, index) => {
    remove(name);
    dispatch(deleteProductItem(index));
  };

  const addItem = (add, name) => {
    add(name);
    dispatch(addProductItem());
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
                type='number'
                style={{ width: '100%' }}
                size='large'
                min={0}
                step={1}
                onChange={(value) => handleStockChange(0, value)}
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
                onChange={(value) => handleProductCodeChange(0, value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='color'
              label='Color'
            >
              <Select
                placeholder='Elige un color'
                size='large'
                options={colors}
                onChange={(value) => handleColorChange(0, value)}
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
            onChange={(files) => handleChangeImage(0, files)}
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
        autoComplete='off'
      >
        <Form.List name='product-items'>
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
                    onClick={() => removeItem(remove, name, key + 1)}
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
                          id={`stock-${key}`}
                          name='stock'
                          type='number'
                          min={0}
                          step={1}
                          size='large'
                          style={{ width: '100%' }}
                          onChange={(value) => handleStockChange(key + 1, value)}
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
                          id={`productCode-${key}`}
                          style={{ width: '100%' }}
                          size='large'
                          onChange={(value) => handleProductCodeChange(key + 1, value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        label='Color'
                      >
                        <Select
                          id={`color-${key}`}
                          placeholder='Elige un color'
                          size='large'
                          options={colors}
                          onChange={(value) => handleColorChange(key + 1, value)}
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
                  onClick={() => addItem(add)}
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
